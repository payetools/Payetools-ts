// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IEarningsDetails } from "./IEarningsDetails";
import { IEmployeePayStructure } from "./IEmployeePayStructure";
import { PayRateType } from "./PayRateType";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents the pay structure for hourly paid employees.
 */
export class HourlyPaidPayStructure implements IEmployeePayStructure {
  /** @inheritdoc */
  public id: string;

  /** @inheritdoc */
  public payRate: Money = zeroGbp;

  /** @inheritdoc */
  public get payRateType(): PayRateType {
    return PayRateType.HourlyPaid;
  }

  /** @inheritdoc */
  public payComponent: IEarningsDetails;

  constructor() {
    this.id = crypto.randomUUID();
    this.payComponent = {} as IEarningsDetails;
  }
}
