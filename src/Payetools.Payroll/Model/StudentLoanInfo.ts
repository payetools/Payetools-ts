// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { StudentLoanType } from "~/Payetools.Common/Model/StudentLoanType";

/**
 * Interface that holds student loan status information for an employee.
 */
export class StudentLoanInfo {
  /**
   * Gets the student loan applicable for an employee. Null if the employee does not have an
   * outstanding student loan.
   */
  public studentLoanType?: StudentLoanType;

  /**
   * Gets a value indicating whether the employee has an outstanding post-graduate loan.
   */
  public hasPostGraduateLoan: boolean = false;
}
