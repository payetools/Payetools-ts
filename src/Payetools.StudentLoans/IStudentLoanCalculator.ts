// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { StudentLoanType } from "~/Payetools.Common/Model/StudentLoanType";
import { IStudentLoanCalculationResult } from "./Model/IStudentLoanCalculationResult";
import { Money } from "@dintero/money";

/**
 * Interface that student loan calculators must implement.
 */
export interface IStudentLoanCalculator {
  /**
   * Calculates the necessary student loan deduction based on the input salary, the student loan type (if applicable) and
   * indication of whether to apply post-graduate loan deductions.
   *
   * @param grossSalary - Gross salary.
   * @param studentLoanType - Optional student loan type. Null if no student loan applies.
   * @param hasPostGradLoan - True if post-graduate loan deductions should be applied; false otherwise.
   * @param result - An implementation of IStudentLoanCalculationResult containing the results of the calculation.
   */
  calculate(
    grossSalary: Money,
    studentLoanType: StudentLoanType | null,
    hasPostGradLoan: boolean,
  ): IStudentLoanCalculationResult;
}
