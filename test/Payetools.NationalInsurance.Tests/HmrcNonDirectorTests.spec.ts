// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect, beforeEach } from "vitest";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { INiCalculator } from "~/Payetools.NationalInsurance/INiCalculator";
import { IHmrcNiTestDataEntry } from "../Payetools.Testing.Data/NationalInsurance/IHmrcNiTestDataEntry";
import { TestDataRepository } from "../Payetools.Testing.Data/TestDataRepository";
import { TestScope } from "../Payetools.Testing.Data/TestScope";
import { TestSource } from "../Payetools.Testing.Data/TestSource";
import { NiCalculatorFactoryDataFixture } from "./NiCalculatorFactoryDataFixture";
import { toDebugString } from "../Payetools.Testing.Data/RepositoryExtensions/IHmrcNiTestDataEntryExtensions";
import { gbp } from "~/CurrencyHelpers";

describe("HmrcNonDirectorTests", () => {
  let output: Console;
  let calculatorDataFixture: NiCalculatorFactoryDataFixture;

  beforeEach(() => {
    output = console;
    calculatorDataFixture = new NiCalculatorFactoryDataFixture();
  });

  it("RunAllNonDirectorTests_2022_2023", async () => {
    const taxYear = TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023);

    await runAllNonDirectorTests(taxYear);
    await runLowIncomeTestAsync(taxYear);
  });

  it("RunAllNonDirectorTests_2023_2024", async () => {
    await runAllNonDirectorTests(
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2024),
    );
  });

  async function runAllNonDirectorTests(taxYear: TaxYear) {
    const db = new TestDataRepository();

    const testData = db
      .getHmrcNationalInsuranceData()
      .filter(
        (t) =>
          t.relatesTo === "Employee" &&
          t.taxYearEnding === taxYear.taxYearEnding,
      );

    if (testData.length === 0) {
      throw new Error("No National Insurance tests found");
    }

    console.log(`${testData.length} tests found`);
    output.log(`${testData.length} National Insurance tests found`);

    let testsCompleted = 0;

    for (const test of testData) {
      const payDate = new PayDate(
        taxYear.getLastDayOfTaxPeriod(test.payFrequency, test.period),
        test.payFrequency,
      );

      const calculator = await getCalculator(payDate);

      const result = calculator.calculate(test.niCategory, test.grossPay);

      expect(
        result.employeeContribution.toNumber(),
        `input is ${toDebugString(test)} and output is { ${result.toString()} } (test #${testsCompleted + 1})`,
      ).toBe(test.employeeNiContribution.toNumber());
      expect(
        result.employerContribution.toNumber(),
        `input is ${toDebugString(test)} and output is { ${result.toString()} } (test #${testsCompleted + 1})`,
      ).toBe(test.employerNiContribution.toNumber());
      expect(result.earningsBreakdown.earningsAtLEL.toNumber()).toBe(
        test.earningsAtLEL_YTD.toNumber(),
      );

      const lelToPt =
        result.earningsBreakdown.earningsAboveLELUpToAndIncludingST.add(
          result.earningsBreakdown.earningsAboveSTUpToAndIncludingPT,
        );
      expect(lelToPt.toNumber()).toBe(test.earningsLELtoPT_YTD.toNumber());

      const ptToUel =
        result.earningsBreakdown.earningsAbovePTUpToAndIncludingFUST.add(
          result.earningsBreakdown.earningsAboveFUSTUpToAndIncludingUEL,
        );
      expect(ptToUel.toNumber()).toBe(test.earningsPTtoUEL_YTD.toNumber());

      expect(result.totalContribution.toNumber()).toBe(
        test.totalNiContribution.toNumber(),
      );

      testsCompleted++;
    }

    output.log(`${testsCompleted} tests completed`);
  }

  async function runLowIncomeTestAsync(taxYear: TaxYear) {
    const earnings = gbp(15.5);

    const payDate = new PayDate(
      taxYear.getLastDayOfTaxPeriod(PayFrequency.Weekly, 32),
      PayFrequency.Weekly,
    );
    const calculator = await getCalculator(payDate);
    const result = calculator.calculate(NiCategory.A, earnings);

    expect(
      result.employeeContribution.toNumber(),
      "Low income NI test #1",
    ).toBe(0.0);
    expect(
      result.employerContribution.toNumber(),
      "Low income NI test #2",
    ).toBe(0.0);
    expect(
      result.earningsBreakdown.earningsAtLEL.toNumber(),
      "Low income NI test #3",
    ).toBe(0);
    expect(result.niCategory).toBe(NiCategory.A);
    expect(result.nicablePay.toNumber()).toBe(earnings.toNumber());
  }

  async function getCalculator(payDate: PayDate): Promise<INiCalculator> {
    const provider = await calculatorDataFixture.getFactory();
    return provider.getCalculator(payDate);
  }
});
