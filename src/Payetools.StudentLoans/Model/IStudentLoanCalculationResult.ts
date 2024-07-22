// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { StudentLoanType } from "~/Payetools.Common/Model/StudentLoanType";

/**
 * Interface that types implement to provide access to the results of a student loan calculation.
 */
export interface IStudentLoanCalculationResult {
  /**
   * Gets the optional student loan type. Null if no student loan applied. (Post-graduate loans
   * are treated separately via hasPostGradLoan).
   */
  studentLoanType?: StudentLoanType;

  /**
   * Gets a value indicating whether post-graduate loan deductions were applied.
   */
  hasPostGradLoan: boolean;

  /**
   * Gets the student loan threshold for the period used in calculating student loan
   * (but not post-graduate loan) deductions.
   */
  studentLoanThresholdUsed?: Money;

  /**
   * Gets the post-graduate loan threshold for the period used in calculating student loan
   * (but not student loan) deductions.
   */
  postGradLoanThresholdUsed?: Money;

  /**
   * Gets the student loan deduction applied (excluding post-grad loan deductions).
   * amounts.
   */
  studentLoanDeduction: Money;

  /**
   * Gets the post-graduate loan deduction applied.
   * amounts.
   */
  postgraduateLoanDeduction: Money;

  /**
   * Gets the total deduction to be made, the sum of any student and post-graduate loan deduction
   * amounts.
   */
  totalDeduction: Money;
}
