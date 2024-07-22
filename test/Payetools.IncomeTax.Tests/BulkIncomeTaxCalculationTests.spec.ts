// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect, beforeEach } from "vitest";
import {
  CountriesForTaxPurposesConverter,
  CountriesForTaxPurposes,
} from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { TaxCalculatorFactoryDataFixture } from "./TaxCalculatorFactoryDataFixture";
import { TestDataRepository } from "../Payetools.Testing.Data/TestDataRepository";
import { IHmrcIncomeTaxTestDataEntry } from "../Payetools.Testing.Data/IncomeTax/IHmrcIncomeTaxTestDataEntry";
import { TestScope } from "../Payetools.Testing.Data/TestScope";
import { TestSource } from "../Payetools.Testing.Data/TestSource";
import { zeroGbp } from "~/CurrencyHelpers";
import { DateOnlyExtensions } from "~/Payetools.Common/Extensions/DateOnlyExtensions";
import { getFullTaxCode } from "../Payetools.Testing.Data/RepositoryExtensions/IHmrcIncomeTaxTestDataEntryExtensions";

/**
 * Test class for bulk income tax calculation.
 */
describe("BulkIncomeTaxCalculationTests", () => {
  const calculatorDataFixture: TaxCalculatorFactoryDataFixture =
    new TaxCalculatorFactoryDataFixture();

  it("RunTests_2022_2023", async () => {
    await runTests(TaxYearEnding.Apr5_2023);
  });

  it("RunTests_2023_2024", async () => {
    await runTests(TaxYearEnding.Apr5_2024);
  });

  async function runTests(taxYearEnding: TaxYearEnding) {
    const db = new TestDataRepository();

    const testData = db
      .getIncomeTaxData()
      .filter((t) => t.taxYearEnding === taxYearEnding);

    if (!testData.length) {
      throw new Error("No income tax tests found");
    }

    console.log(`${testData.length} tests found`);

    let testIndex = 1;
    let testCompleted = 0;

    for (const test of testData) {
      const taxYear = TaxYear.fromTaxYearEnding(taxYearEnding);
      const taxCode = getFullTaxCode(test, taxYear);

      const applicableCountries = CountriesForTaxPurposesConverter.toEnum(
        test.relatesTo,
      );

      const calculator = await getCalculator(
        applicableCountries,
        taxYear,
        test.payFrequency,
        test.period,
      );

      console.log(
        `Running test ${testIndex} with tax code '${taxCode}', period ${test.period}`,
      );

      const result = calculator.calculate(
        test.grossPay,
        zeroGbp,
        taxCode,
        test.taxablePayToDate.subtract(test.grossPay),
        test.taxDueToDate.subtract(test.taxDueInPeriod),
        zeroGbp,
      );

      if (!test.taxDueInPeriod.equals(result.finalTaxDue)) {
        console.log(
          `Variance in test ${testIndex} (${taxCode}); expected: ${test.taxDueInPeriod}, actual ${result.finalTaxDue}`,
        );
      }

      expect(
        result.finalTaxDue.amount().toNumber(),
        `test failed with ${test.taxDueInPeriod} != ${result.finalTaxDue} (Index ${testIndex}, tax code ${test.taxCode})`,
      ).toBe(test.taxDueInPeriod.amount().toNumber());

      testCompleted++;
      testIndex++;
    }

    console.log(`${testCompleted} tests completed successfully`);
  }

  async function getCalculator(
    applicableCountries: CountriesForTaxPurposes,
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    payPeriod: number,
  ) {
    const provider = await calculatorDataFixture.getFactory();

    return provider.getCalculator(
      applicableCountries,
      DateOnlyExtensions.toPayDate(
        taxYear.getLastDayOfTaxPeriod(payFrequency, payPeriod),
        payFrequency,
      ),
    );
  }
});
