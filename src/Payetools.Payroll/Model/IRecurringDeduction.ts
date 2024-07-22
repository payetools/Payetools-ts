// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IApplicableFromTill } from "~/Payetools.Common/Model/IApplicableFromTill";
import { IDeductionDetails } from "./IDeductionDetails";
import { IPayrollAmount } from "./IPayrollAmount";

/**
 * Interface that represents a recurring deduction for an employee.
 */
export interface IRecurringDeduction
  extends IApplicableFromTill,
    IPayrollAmount {
  /**
   * Gets the deduction type for this recurring deduction.
   */
  deductionType: IDeductionDetails;
}
