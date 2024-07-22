// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IEarningsDetails } from "./IEarningsDetails";

/**
 * Represents an element of an employee's pay.
 */
export interface IEarningsEntry {
  /**
   * Gets the type of deduction.
   */
  earningsDetails: IEarningsDetails;

  /**
   * Gets the quantity of this earnings entry that when multiplied by the `valuePerUnit` gives the total earnings.
   */
  quantityInUnits?: number;

  /**
   * Gets the GBP value per unit that when multiplied by the `quantityInUnits` gives the total earnings.
   */
  valuePerUnit?: Money;

  /**
   * Gets the total earnings to be applied.
   */
  totalEarnings: Money;

  /**
   * Returns a new earnings entry which is the sum of the existing entry and the supplied entry.
   * @param earningsEntry Earnings entry data to add.
   * @returns A new instance that implements `IEarningsEntry` containing the sum of the original entry and the supplied entry.
   * @remarks As it is possible for a unit-based earnings entry to have a different `valuePerUnit`, this method sets this property to null to avoid holding confusing/erroneous information.
   * @throws {ArgumentException} Thrown if the supplied `earningsDetails` property does not exactly match the existing property value.
   */
  add(earningsEntry: IEarningsEntry): IEarningsEntry;
}
