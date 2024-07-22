// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { StudentLoanType } from "~/Payetools.Common/Model/StudentLoanType";
import { StarterDeclaration } from "./StarterDeclaration";

/**
 * Interface that represents a new starter for employment purposes.
 */
export interface INewStarterInfo {
  /**
   * Gets the employee's starter declaration; null if it was not possible to
   * obtain a starter declaration from the employee.
   */
  starterDeclaration: StarterDeclaration | null;

  /**
   * Gets a value indicating whether student loan deductions should continue.
   *
   * As a P45 from a previous employer does not indicate the student loan type,
   * it may be necessary to request the employee's student loan plan type separately.
   */
  studentLoanDeductionNeeded: boolean;

  /**
   * Gets any applicable student loan type, if known.  (See studentLoanDeductionNeeded).
   */
  studentLoanType: StudentLoanType | null;

  /**
   * Gets a value indicating whether postgraduate loan deductions should continue.
   */
  postgraduateLoanDeductionNeeded: boolean;
}
