// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IApplicableFromTill } from "~/Payetools.Common/Model/IApplicableFromTill";
import { IEarningsDetails } from "./IEarningsDetails";
import { IPayrollAmount } from "./IPayrollAmount";

/**
 * Interface that represents a recurring earnings for an employee.
 */
export interface IRecurringEarnings
  extends IApplicableFromTill,
    IPayrollAmount {
  /**
   * Gets the pay component for this recurring earnings.
   */
  payComponent: IEarningsDetails;
}
