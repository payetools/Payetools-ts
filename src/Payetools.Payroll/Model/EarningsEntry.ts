// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ArgumentException } from "~/Payetools.Common/Diagnostics/ArgumentException";
import { IEarningsDetails } from "./IEarningsDetails";
import { IEarningsEntry } from "./IEarningsEntry";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents an element of an employee's pay.
 */
export class EarningsEntry implements IEarningsEntry {
  /**
   * @summary Gets the type of deduction.
   */
  earningsDetails: IEarningsDetails;

  /**
   * @summary Gets the quantity of this earnings entry that when multiplied by the `valuePerUnit` gives the total earnings.
   */
  public quantityInUnits?: number;

  /**
   * @summary Gets the GBP value per unit that when multiplied by the `quantityInUnits` gives the total earnings.
   */
  public valuePerUnit?: Money;

  /**
   * @summary Gets the fixed amount of the earnings, if that is specified in place of quantity and value per unit. Used for absolute amounts.
   */
  public fixedAmount?: Money;

  constructor(
    earningsDetails: IEarningsDetails,
    quantityInUnits?: number,
    valuePerUnit?: Money,
    fixedAmount?: Money,
  ) {
    this.earningsDetails = earningsDetails;
    this.quantityInUnits = quantityInUnits;
    this.valuePerUnit = valuePerUnit;
    this.fixedAmount = fixedAmount;
  }

  /**
   * @summary Gets the total earnings to be applied.
   */
  public get totalEarnings(): Money {
    return (
      this.fixedAmount ??
      (this.valuePerUnit ?? zeroGbp).multiply(this.quantityInUnits ?? 0)
    );
  }

  /**
   * @summary Returns a new earnings entry which is the sum of the existing entry and the supplied entry.
   * @param earningsEntry Earnings entry data to add.
   * @returns A new instance that implements `IEarningsEntry` containing the sum of the original entry and the supplied entry.
   * @remarks As it is possible for a unit-based earnings entry to have a different `valuePerUnit`, this method sets this property to null to avoid holding confusing/erroneous information.
   * @throws {ArgumentException} Thrown if the supplied `earningsDetails` property does not exactly match the existing property value.
   */
  public add(earningsEntry: IEarningsEntry): IEarningsEntry {
    if (earningsEntry.earningsDetails !== this.earningsDetails)
      throw new ArgumentException(
        "Earnings details of supplied earnings entry must match existing earnings details",
        "earningsEntry",
      );

    return new EarningsEntry(
      this.earningsDetails,

      // Keep track of the historical quantity as it may be needed later
      this.quantityInUnits == null || earningsEntry.quantityInUnits == null
        ? undefined
        : this.quantityInUnits + earningsEntry.quantityInUnits,

      // Use null here as no single value makes sense
      undefined,

      // We have to use the fixed amount as we can't rely on the ValuePerUnit not changing
      this.totalEarnings.add(earningsEntry.totalEarnings),
    );
  }
}
