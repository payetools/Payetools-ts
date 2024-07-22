// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IEarningsDetails } from "./IEarningsDetails";
import { PayRateType } from "./PayRateType";

/**
 * Interface that represents an employee's pay structure.
 */
export interface IEmployeePayStructure {
  /**
   * Gets the unique ID for this pay structure.
   */
  id: string;

  /**
   * Gets the rate of pay. The type of this rate of pay is given by PayRateType.
   */
  payRate: Money;

  /**
   * Gets the type of pay that payRate represents.
   */
  payRateType: PayRateType;

  /**
   * Gets the pay component that this pay structure is based on.
   */
  payComponent: IEarningsDetails;
}
