// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IEarningsDetails } from "./IEarningsDetails";
import { PayRateType } from "./PayRateType";
import { IEmployeePayStructure } from "./IEmployeePayStructure";
import { Money } from "@dintero/money";

/**
 * Represents the pay structure for salaried (i.e., annually paid) employees.
 */
class SalariedPayStructure implements IEmployeePayStructure {
  /**
   * Unique identifier for the pay structure.
   */
  id: string;

  /**
   * The pay rate for the employee.
   */
  payRate: Money;

  /**
   * The type of pay rate.
   */
  payRateType: PayRateType = PayRateType.Salaried;

  /**
   * The pay component details.
   */
  payComponent: IEarningsDetails;

  constructor(
    id: string = crypto.randomUUID(),
    payRate: Money,
    payComponent: IEarningsDetails,
  ) {
    this.id = id;
    this.payRate = payRate;
    this.payComponent = payComponent;
  }
}
