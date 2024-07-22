// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IDeductionDetails } from "./IDeductionDetails";
import { IDeductionEntry } from "./IDeductionEntry";

/**
 * Interface that represents an employee's deductions history for the tax year to date.
 */
export interface IDeductionsHistoryYtd {
  /**
   * Gets a dictionary of deductions year to date keyed on the deduction details.
   */
  deductions: Map<IDeductionDetails, IDeductionEntry>;

  /**
   * Adds the supplied deductions to the current instance.
   * @param deductions Deductions to apply.
   * @returns A reference to the current history, as a convenience.
   */
  apply(deductions: Iterable<IDeductionEntry>): IDeductionsHistoryYtd;
}
