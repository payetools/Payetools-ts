// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IDeductionDetails } from "./IDeductionDetails";
import { IDeductionEntry } from "./IDeductionEntry";
import { IDeductionsHistoryYtd } from "./IDeductionsHistoryYtd";

/**
 * Represents an employee's deductions history for the tax year to date.
 * @remarks Note that this type is mutable (via the {@link DeductionsHistoryYtd#apply} method;
 * however its one property is not mutable, since it returns an immutable dictionary which contains a type that is itself
 * immutable.
 */
export class DeductionsHistoryYtd implements IDeductionsHistoryYtd {
  readonly deductions: Map<IDeductionDetails, IDeductionEntry>;

  // /**
  //  * Gets a dictionary of deductions year to date keyed on the deduction details.
  //  */
  // public get deductions(): ImmutableMap<IDeductionDetails, IDeductionEntry> {
  //   return ImmutableMap(this._deductions);
  // }

  /**
   * Initialises a new empty `DeductionsHistoryYtd`.
   */
  constructor() {
    this.deductions = new Map<IDeductionDetails, IDeductionEntry>();
  }

  /**
   * Adds the supplied deductions to the current instance.
   * @param deductions Deductions to apply.
   * @returns A reference to the current history, as a convenience.
   */
  public apply(deductions: Iterable<IDeductionEntry>): IDeductionsHistoryYtd {
    for (const entry of deductions) {
      if (this.deductions.has(entry.deductionClassification)) {
        const existingEntry = this.deductions.get(
          entry.deductionClassification,
        )!;
        this.deductions.set(
          entry.deductionClassification,
          existingEntry.add(entry),
        );
      } else {
        this.deductions.set(entry.deductionClassification, entry);
      }
    }

    return this;
  }
}
