// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { StudentLoanType } from "~/Payetools.Common/Model/StudentLoanType";
import { IStudentLoanCalculationResult } from "./IStudentLoanCalculationResult";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents the result of a student loan calculation.
 */
export class StudentLoanCalculationResult
  implements IStudentLoanCalculationResult
{
  /**
   * Gets an empty `StudentLoanCalculationResult` that indicates that no pension is applicable.
   */
  public static noStudentLoanApplicable: StudentLoanCalculationResult =
    new StudentLoanCalculationResult();

  /**
   * Gets the optional student loan type. Null if no student loan applied. (Post-graduate loans
   * are treated separately via `hasPostGradLoan`).
   */
  public studentLoanType?: StudentLoanType;

  /**
   * Gets a value indicating whether post-graduate loan deductions were applied.
   */
  public hasPostGradLoan: boolean;

  /**
   * Gets the student loan threshold for the period used in calculating student loan
   * (but not post-graduate loan) deductions.
   */
  public studentLoanThresholdUsed?: Money;

  /**
   * Gets the post-graduate loan threshold for the period used in calculating student loan
   * (but not student loan) deductions.
   */
  public postGradLoanThresholdUsed?: Money;

  /**
   * Gets the student loan deduction applied (excluding post-grad loan deductions).
   * amounts.
   */
  public studentLoanDeduction: Money;

  /**
   * Gets the post-graduate loan deduction applied.
   * amounts.
   */
  public postgraduateLoanDeduction: Money;

  /**
   * Gets the total deduction to be made, the sum of any student and post-graduate loan deduction
   * amounts.
   */
  public totalDeduction: Money;

  constructor(
    studentLoanType?: StudentLoanType,
    hasPostGradLoan: boolean = false,
    studentLoanThresholdUsed?: Money,
    postGradLoanThresholdUsed?: Money,
    studentLoanDeduction: Money = zeroGbp,
    postgraduateLoanDeduction: Money = zeroGbp,
    totalDeduction: Money = zeroGbp,
  ) {
    this.studentLoanType = studentLoanType;
    this.hasPostGradLoan = hasPostGradLoan;
    this.studentLoanThresholdUsed = studentLoanThresholdUsed;
    this.postGradLoanThresholdUsed = postGradLoanThresholdUsed;
    this.studentLoanDeduction = studentLoanDeduction;
    this.postgraduateLoanDeduction = postgraduateLoanDeduction;
    this.totalDeduction = totalDeduction;
  }
}
