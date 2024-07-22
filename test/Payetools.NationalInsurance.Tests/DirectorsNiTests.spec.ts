import { describe, expect, it } from "vitest";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { NiCalculatorFactoryDataFixture } from "./NiCalculatorFactoryDataFixture";
import { CalendarDate } from "calendar-date";
import { DirectorsNiCalculationMethod } from "~/Payetools.NationalInsurance/Model/DirectorsNiCalculationMethod";
import { gbp, zeroGbp } from "~/CurrencyHelpers";

describe("DirectorsNiTests", () => {
  const calculatorDataFixture = new NiCalculatorFactoryDataFixture();

  const getTests = (
    niCategory: NiCategory,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ) => [
    {
      payFrequency,
      niCategory,
      period: taxPeriod,
      relatesTo: "Director",
      grossPay: gbp(5000),
      earningsAtLEL_YTD: 0,
      earningsLELtoPT_YTD: 0,
      earningsPTtoUEL_YTD: 0,
      employeeNiContribution: 0,
      employerNiContribution: 0,
      totalNiContribution: 0,
      totalEmployeeContributions_YTD: 0,
      totalEmployerContributions_YTD: 0,
    },
    {
      payFrequency,
      niCategory,
      period: taxPeriod,
      relatesTo: "Director",
      grossPay: gbp(9000),
      earningsAtLEL_YTD: 6396.0,
      earningsLELtoPT_YTD: 2604.0,
      earningsPTtoUEL_YTD: 0,
      employeeNiContribution: 0,
      employerNiContribution: 0,
      totalNiContribution: 0,
      totalEmployeeContributions_YTD: 0,
      totalEmployerContributions_YTD: 0,
    },
    {
      payFrequency,
      niCategory,
      period: taxPeriod,
      relatesTo: "Director",
      grossPay: gbp(9100),
      earningsAtLEL_YTD: 6396.0,
      earningsLELtoPT_YTD: 2704.0,
      earningsPTtoUEL_YTD: 0,
      employeeNiContribution: 0,
      employerNiContribution: 0,
      totalNiContribution: 0,
      totalEmployeeContributions_YTD: 0,
      totalEmployerContributions_YTD: 0,
    },
    {
      payFrequency,
      niCategory,
      period: taxPeriod,
      relatesTo: "Director",
      grossPay: gbp(9101),
      earningsAtLEL_YTD: 6396.0,
      earningsLELtoPT_YTD: 2705.0,
      earningsPTtoUEL_YTD: 0,
      employeeNiContribution: 0,
      employerNiContribution: 0.14,
      totalNiContribution: 0.14,
      totalEmployeeContributions_YTD: 0,
      totalEmployerContributions_YTD: 0,
    },
    {
      payFrequency,
      niCategory,
      period: taxPeriod,
      relatesTo: "Director",
      grossPay: gbp(11908),
      earningsAtLEL_YTD: 6396.0,
      earningsLELtoPT_YTD: 11908 - 6396,
      earningsPTtoUEL_YTD: 0,
      employeeNiContribution: 0,
      employerNiContribution: 408.0,
      totalNiContribution: 408.0,
      totalEmployeeContributions_YTD: 0,
      totalEmployerContributions_YTD: 0,
    },
    {
      payFrequency,
      niCategory,
      period: taxPeriod,
      relatesTo: "Director",
      grossPay: gbp(11909),
      earningsAtLEL_YTD: 6396.0,
      earningsLELtoPT_YTD: 11908 - 6396,
      earningsPTtoUEL_YTD: 1,
      employeeNiContribution: 0.13,
      employerNiContribution: 408.15,
      totalNiContribution: 408.28,
      totalEmployeeContributions_YTD: 0,
      totalEmployerContributions_YTD: 0,
    },
  ];

  const getCalculator = async (payDate: PayDate) => {
    const provider = await calculatorDataFixture.getFactory();
    return provider.getCalculator(payDate);
  };

  it("RunFullYearDirectorTests_2023_2023", async () => {
    const taxYear = TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023);
    const testData = getTests(NiCategory.A, PayFrequency.Monthly, 12);

    for (const test of testData.filter(
      (t) =>
        t.relatesTo === "Director" &&
        (t.payFrequency === PayFrequency.Monthly ||
          t.payFrequency === PayFrequency.Weekly ||
          t.payFrequency === PayFrequency.FourWeekly),
    )) {
      const payDate = new PayDate(
        taxYear.getLastDayOfTaxPeriod(test.payFrequency, test.period),
        test.payFrequency,
      );
      const calculator = await getCalculator(payDate);

      const result = calculator.calculateDirectors(
        DirectorsNiCalculationMethod.StandardAnnualisedEarningsMethod,
        test.niCategory,
        test.grossPay,
        zeroGbp,
        zeroGbp,
        zeroGbp,
        undefined,
      );

      expect(result.employeeContribution.toNumber()).toBe(
        test.employeeNiContribution,
      );
      expect(result.employerContribution.toNumber()).toBe(
        test.employerNiContribution,
      );
      expect(result.earningsBreakdown.earningsAtLEL.toNumber()).toBe(
        test.earningsAtLEL_YTD,
      );

      const lelToPt =
        result.earningsBreakdown.earningsAboveLELUpToAndIncludingST.add(
          result.earningsBreakdown.earningsAboveSTUpToAndIncludingPT,
        );
      expect(lelToPt.toNumber()).toBe(test.earningsLELtoPT_YTD);

      const ptToUel =
        result.earningsBreakdown.earningsAbovePTUpToAndIncludingFUST.add(
          result.earningsBreakdown.earningsAboveFUSTUpToAndIncludingUEL,
        );
      expect(ptToUel.toNumber()).toBe(test.earningsPTtoUEL_YTD);

      expect(result.totalContribution.toNumber()).toBe(
        test.totalNiContribution,
      );
    }
  });
});
