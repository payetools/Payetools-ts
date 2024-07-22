// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect, beforeEach } from "vitest";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import {
  PayFrequency,
  PayFrequencyExtensions,
} from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { INiCalculator } from "~/Payetools.NationalInsurance/INiCalculator";
import { DirectorsNiCalculationMethod } from "~/Payetools.NationalInsurance/Model/DirectorsNiCalculationMethod";
import { INiCalculationResult } from "~/Payetools.NationalInsurance/Model/INiCalculationResult";
import { IHmrcDirectorsNiTestDataEntry } from "../Payetools.Testing.Data/NationalInsurance/IHmrcDirectorsNiTestDataEntry";
import { TestDataRepository } from "../Payetools.Testing.Data/TestDataRepository";
import { TestScope } from "../Payetools.Testing.Data/TestScope";
import { TestSource } from "../Payetools.Testing.Data/TestSource";
import { NiCalculatorFactoryDataFixture } from "./NiCalculatorFactoryDataFixture";
import { CalendarDate } from "calendar-date";
import { RoundDown, gbp } from "~/CurrencyHelpers";
import { toDebugString } from "../Payetools.Testing.Data/RepositoryExtensions/IHmrcDirectorsNiTestDataEntryExtensions";

describe("HmrcDirectorTests", () => {
  let calculatorDataFixture: NiCalculatorFactoryDataFixture;

  beforeEach(() => {
    calculatorDataFixture = new NiCalculatorFactoryDataFixture();
  });

  it("RunAllDirectorTests_2022_2023", async () => {
    const taxYear = TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023);
    const firstPayDate = taxYear.startOfTaxYear.addDays(2);

    await runAllDirectorTests(taxYear, firstPayDate);
  });

  it("RunAllDirectorTests_2023_2024", async () => {
    const taxYear = TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2024);
    const firstPayDate = taxYear.startOfTaxYear.addDays(5);

    await runAllDirectorTests(taxYear, firstPayDate);
  });

  async function runAllDirectorTests(
    taxYear: TaxYear,
    firstPayDate: CalendarDate,
  ): Promise<void> {
    const db = new TestDataRepository();

    const testData = db
      .getHmrcDirectorsNationalInsuranceData()
      .filter(
        (t) =>
          t.relatesTo === "Director" &&
          t.taxYearEnding === taxYear.taxYearEnding,
      );

    if (testData.length === 0) {
      throw new Error("No National Insurance tests found");
    }

    console.log(`${testData.length} tests found`);

    let testsCompleted = 0;

    for (const test of testData) {
      let result: INiCalculationResult;

      // The following is needed because HMRC refers the last tax period for an annual payroll as 52 rather than 1.
      const payDate =
        test.payFrequency === PayFrequency.Weekly
          ? new PayDate(
              firstPayDate.addDays(
                PayFrequencyExtensions.getTaxPeriodLength(test.payFrequency) *
                  (test.period - 1),
              ),
              test.payFrequency,
            )
          : test.payFrequency === PayFrequency.Annually
            ? new PayDate(
                taxYear.getLastDayOfTaxPeriod(PayFrequency.Annually, 1),
                PayFrequency.Annually,
              )
            : (() => {
                throw new Error(
                  "Currently only weekly and annual frequencies are included in HMRC test data",
                );
              })();

      const calculator = await getCalculator(payDate);

      // Clean up issues caused by original Excel-based source data
      const employeeNiContributionYtd = test.employeeNiContributionYtd.round(
        4,
        RoundDown,
      );
      const employerNiContributionYtd = test.employerNiContributionYtd.round(
        4,
        RoundDown,
      );
      const grossPayYtd = test.grossPayYtd.round(4, RoundDown);

      switch (test.statusMethod) {
        case "ALT":
          result = calculator.calculateDirectors(
            DirectorsNiCalculationMethod.AlternativeMethod,
            test.niCategory,
            test.grossPay,
            gbp(grossPayYtd.sub(test.grossPay.amount())),
            gbp(
              employeeNiContributionYtd.sub(
                test.employeeNiContribution.amount(),
              ),
            ),
            gbp(
              employerNiContributionYtd.sub(
                test.employerNiContribution.amount(),
              ),
            ),
            test.proRataFactor,
          );
          break;

        case "STD":
          result = calculator.calculateDirectors(
            DirectorsNiCalculationMethod.StandardAnnualisedEarningsMethod,
            test.niCategory,
            test.grossPay,
            gbp(grossPayYtd.sub(test.grossPay.amount())),
            gbp(
              employeeNiContributionYtd.sub(
                test.employeeNiContribution.amount(),
              ),
            ),
            gbp(
              employerNiContributionYtd.sub(
                test.employerNiContribution.amount(),
              ),
            ),
            test.proRataFactor,
          );
          break;

        case "EMP":
          result = calculator.calculate(test.niCategory, test.grossPay);
          break;

        default:
          throw new Error(
            `Unrecognised value for StatusMethod: '${test.statusMethod}'`,
          );
      }

      const testInfo = `input is ${toDebugString(test)} and output is { ${result.toString()} } (test #${testsCompleted + 1})`;

      expect(result.employeeContribution.toNumber(), testInfo).toBe(
        test.employeeNiContribution.toNumber(),
      );
      expect(result.employerContribution.toNumber(), testInfo).toBe(
        test.employerNiContribution.toNumber(),
      );
      expect(result.totalContribution.toNumber(), testInfo).toBe(
        test.totalNiContribution.toNumber(),
      );

      // Currently can only test this on the last payrun of the year
      if (test.period === 52) {
        expect(
          result.earningsBreakdown.earningsAtLEL.toNumber(),
          testInfo,
        ).toBe(test.earningsAtLEL_YTD.toNumber());

        const lelToPt =
          result.earningsBreakdown.earningsAboveLELUpToAndIncludingST.add(
            result.earningsBreakdown.earningsAboveSTUpToAndIncludingPT,
          );
        expect(lelToPt.toNumber(), testInfo).toBe(
          test.earningsLELtoPT_YTD.toNumber(),
        );

        const ptToUel =
          result.earningsBreakdown.earningsAbovePTUpToAndIncludingFUST.add(
            result.earningsBreakdown.earningsAboveFUSTUpToAndIncludingUEL,
          );
        expect(ptToUel.toNumber(), testInfo).toBe(
          test.earningsPTtoUEL_YTD.toNumber(),
        );
      }

      testsCompleted++;
    }

    console.log(`${testsCompleted} tests completed`);
  }

  async function getCalculator(payDate: PayDate): Promise<INiCalculator> {
    const provider = await calculatorDataFixture.getFactory();
    return provider.getCalculator(payDate);
  }
});
