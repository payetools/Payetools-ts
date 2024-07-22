// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Interface for types that detail the various HMRC-published student loan deduction rates.
 */
export interface IStudentLoanRateSet {
  /**
   * Gets the deduction rate for Plan 1, 2 and 4 student loan deductions.
   */
  student: Big;

  /**
   * Gets the deduction rate for post-graduate student loan deductions.
   */
  postGrad: Big;
}
