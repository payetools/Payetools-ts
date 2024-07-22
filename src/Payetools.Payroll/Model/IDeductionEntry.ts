// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IDeductionDetails } from "./IDeductionDetails";

/**
 * Interface that represents a deduction from payroll.
 */
export interface IDeductionEntry {
  /**
   * Gets the type of deduction.
   */
  deductionClassification: IDeductionDetails;

  /**
   * Gets the quantity of this deduction that when multiplied by the `valuePerUnit` gives the total deduction. Optional.
   */
  quantityInUnits?: number;

  /**
   * Gets the GBP value per unit that when multiplied by the `quantityInUnits` gives the total deduction. Optional.
   */
  valuePerUnit?: Money;

  /**
   * Gets the total deduction applied.
   */
  totalDeduction: Money;

  /**
   * Returns a new deductions entry which is the sum of the existing entry and the supplied entry.
   * @param deductionEntry Deductions entry data to add.
   * @returns A new instance that implements `IDeductionEntry` containing the sum of the original entry and the supplied entry.
   * @remarks As it is possible for a unit-based earnings entry to have a different `valuePerUnit`, this method sets this property to null to avoid holding confusing/erroneous information.
   * @throws {ArgumentException} Thrown if the supplied `deductionClassification` property does not exactly match the existing property value.
   */
  add(deductionEntry: IDeductionEntry): IDeductionEntry;
}
