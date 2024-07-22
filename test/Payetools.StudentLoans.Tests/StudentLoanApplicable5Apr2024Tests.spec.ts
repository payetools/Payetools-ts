// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { beforeEach, describe, expect, it } from "vitest";
import { StudentLoanCalculatorFactoryDataFixture } from "./StudentLoanCalculatorFactoryDataFixture";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { StudentLoanType } from "~/Payetools.Common/Model/StudentLoanType";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IStudentLoanCalculator } from "~/Payetools.StudentLoans/IStudentLoanCalculator";
import { gbp } from "~/CurrencyHelpers";

describe("StudentLoanApplicable5Apr2024Tests", () => {
  const _taxYear = TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2024);
  let _factoryProviderFixture: StudentLoanCalculatorFactoryDataFixture;

  beforeEach(() => {
    _factoryProviderFixture = new StudentLoanCalculatorFactoryDataFixture();
  });

  it("TestPlan1StudentLoanAsync", async () => {
    const calculator = await getCalculator(_taxYear, PayFrequency.Monthly, 1);

    runTest(
      calculator,
      1500.0,
      StudentLoanType.Plan1,
      false,
      0.0,
      0.0,
      1834.58,
      null,
    );
    runTest(
      calculator,
      1845.69,
      StudentLoanType.Plan1,
      false,
      0.0,
      0.0,
      1834.58,
      null,
    );
    runTest(
      calculator,
      1845.7,
      StudentLoanType.Plan1,
      false,
      1.0,
      0.0,
      1834.58,
      null,
    );
    runTest(
      calculator,
      8179.03,
      StudentLoanType.Plan1,
      false,
      571.0,
      0.0,
      1834.58,
      null,
    );
  });

  it("TestPlan2StudentLoanAsync", async () => {
    const calculator = await getCalculator(_taxYear, PayFrequency.Weekly, 52);

    runTest(
      calculator,
      399.48,
      StudentLoanType.Plan2,
      false,
      0.0,
      0.0,
      524.9,
      null,
    );
    runTest(
      calculator,
      536.01,
      StudentLoanType.Plan2,
      false,
      0.0,
      0.0,
      524.9,
      null,
    );
    runTest(
      calculator,
      536.02,
      StudentLoanType.Plan2,
      false,
      1.0,
      0.0,
      524.9,
      null,
    );
    runTest(
      calculator,
      2113.89,
      StudentLoanType.Plan2,
      false,
      143.0,
      0.0,
      524.9,
      null,
    );
  });

  it("TestPlan4StudentLoan", async () => {
    const calculator = await getCalculator(
      _taxYear,
      PayFrequency.Fortnightly,
      10,
    );

    runTest(
      calculator,
      187.06,
      StudentLoanType.Plan4,
      false,
      0.0,
      0.0,
      1063.84,
      null,
    );
    runTest(
      calculator,
      1074.94,
      StudentLoanType.Plan4,
      false,
      0.0,
      0.0,
      1063.84,
      null,
    );
    runTest(
      calculator,
      1074.95,
      StudentLoanType.Plan4,
      false,
      0.0,
      0.0,
      1063.84,
      null,
    );
    runTest(
      calculator,
      1074.96,
      StudentLoanType.Plan4,
      false,
      1.0,
      0.0,
      1063.84,
      null,
    );
    runTest(
      calculator,
      1075.06,
      StudentLoanType.Plan4,
      false,
      1.0,
      0.0,
      1063.84,
      null,
    );
    runTest(
      calculator,
      1174.96,
      StudentLoanType.Plan4,
      false,
      10.0,
      0.0,
      1063.84,
      null,
    );
    runTest(
      calculator,
      5252.73,
      StudentLoanType.Plan4,
      false,
      377.0,
      0.0,
      1063.84,
      null,
    );
  });

  it("TestPostGradLoan", async () => {
    const calculator = await getCalculator(
      _taxYear,
      PayFrequency.FourWeekly,
      2,
    );

    runTest(calculator, 120.5, undefined, true, 0.0, 0.0, null, 1615.38);
    runTest(calculator, 1632.04, undefined, true, 0.0, 0.0, null, 1615.38);
    runTest(calculator, 1632.05, undefined, true, 0.0, 1.0, null, 1615.38);
    runTest(calculator, 1632.21, undefined, true, 0.0, 1.0, null, 1615.38);
    runTest(calculator, 11182.05, undefined, true, 0.0, 574.0, null, 1615.38);
  });

  it("TestPlan1PlusPostGradLoan", async () => {
    const calculator = await getCalculator(_taxYear, PayFrequency.Monthly, 4);

    runTest(
      calculator,
      2334.69,
      StudentLoanType.Plan1,
      true,
      45.0,
      35.0,
      1834.58,
      1750.0,
    );
  });

  const runTest = (
    calculator: IStudentLoanCalculator,
    grossSalary: number,
    studentLoanType: StudentLoanType | undefined,
    hasPostGradLoan: boolean,
    expectedStudentLoanDeduction: number,
    expectedPostGradLoanDeduction: number,
    expectedStudentLoanThreshold: number | null,
    expectedPostGradLoanThreshold: number | null,
  ) => {
    const result = calculator.calculate(
      gbp(grossSalary),
      studentLoanType ?? null,
      hasPostGradLoan,
    );

    expect(result.studentLoanType).toBe(studentLoanType);
    expect(result.hasPostGradLoan).toBe(hasPostGradLoan);

    if (expectedStudentLoanThreshold == null) {
      expect(result.studentLoanThresholdUsed).toBeUndefined();
    } else {
      expect(result.studentLoanThresholdUsed?.amount().toNumber()).toBe(
        expectedStudentLoanThreshold,
      );
    }

    if (expectedPostGradLoanThreshold == null) {
      expect(result.postGradLoanThresholdUsed).toBeUndefined();
    } else {
      expect(result.postGradLoanThresholdUsed?.amount().toNumber()).toBe(
        expectedPostGradLoanThreshold,
      );
    }

    expect(result.studentLoanDeduction.amount().toNumber()).toBe(
      expectedStudentLoanDeduction,
    );
    expect(result.postgraduateLoanDeduction.amount().toNumber()).toBe(
      expectedPostGradLoanDeduction,
    );
    expect(result.totalDeduction.amount().toNumber()).toBe(
      expectedStudentLoanDeduction + expectedPostGradLoanDeduction,
    );
  };

  const getCalculator = async (
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): Promise<IStudentLoanCalculator> => {
    const provider = await _factoryProviderFixture.getFactory();
    const payDate = new PayDate(
      taxYear.getLastDayOfTaxPeriod(payFrequency, taxPeriod),
      payFrequency,
    );

    return provider.getCalculator(payDate);
  };
});
