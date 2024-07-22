// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IDeductionDetails } from "./IDeductionDetails";
import { IDeductionEntry } from "./IDeductionEntry";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents a deduction from payroll.
 */
export class DeductionEntry implements IDeductionEntry {
  /**
   * Gets the type of deduction.
   */
  deductionClassification: IDeductionDetails;

  /**
   * Gets the quantity of this deduction that when multiplied by the `valuePerUnit` gives the total deduction.
   */
  quantityInUnits?: number;

  /**
   * Gets the GBP value per unit that when multiplied by the `quantityInUnits` gives the total deduction.
   */
  valuePerUnit?: Money;

  /**
   * Gets the fixed amount of the deduction, if that is specified in place of quantity and value per unit. Used for absolute amounts.
   */
  fixedAmount?: Money;

  constructor(
    deductionClassification: IDeductionDetails,
    quantityInUnits?: number,
    valuePerUnit?: Money,
    fixedAmount?: Money,
  ) {
    this.deductionClassification = deductionClassification;
    this.quantityInUnits = quantityInUnits;
    this.valuePerUnit = valuePerUnit;
    this.fixedAmount = fixedAmount;
  }

  /**
   * Gets the total deduction to be applied.
   */
  get totalDeduction(): Money {
    return (
      this.fixedAmount ??
      (this.valuePerUnit ?? zeroGbp).multiply(this.quantityInUnits ?? 0)
    );
  }

  /**
   * Returns a new deductions entry which is the sum of the existing entry and the supplied entry.
   * @param deductionEntry Deductions entry data to add.
   * @returns A new instance that implements `IDeductionEntry` containing the sum of the original entry and the supplied entry.
   * @remarks As it is possible for a unit-based earnings entry to have a different `valuePerUnit`, this method sets this property to null to avoid holding confusing/erroneous information.
   * @throws {Error} Thrown if the supplied `deductionClassification` property does not exactly match the existing property value.
   */
  add(deductionEntry: IDeductionEntry): IDeductionEntry {
    if (
      deductionEntry.deductionClassification !== this.deductionClassification
    ) {
      throw new Error(
        "Deduction classification of supplied deduction entry must match existing deduction classification",
      );
    }

    return new DeductionEntry(
      this.deductionClassification,
      // Keep track of the historical quantity as it may be needed later
      this.quantityInUnits == null || deductionEntry.quantityInUnits == null
        ? undefined
        : this.quantityInUnits + deductionEntry.quantityInUnits,
      // Use null here as no single value makes sense
      undefined,
      // We have to use the fixed amount as we can't rely on the ValuePerUnit not changing
      this.totalDeduction.add(deductionEntry.totalDeduction),
    );
  }
}
