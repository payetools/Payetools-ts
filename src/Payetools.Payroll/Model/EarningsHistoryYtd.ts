// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { EmployeePayrollHistoryYtd } from "./EmployeePayrollHistoryYtd";
import { IEarningsDetails } from "./IEarningsDetails";
import { IEarningsEntry } from "./IEarningsEntry";
import { IEarningsHistoryYtd } from "./IEarningsHistoryYtd";

/**
 * Represents an employee's earnings history for the tax year to date.
 *
 * @remarks Note that this type is mutable (via the `apply` method);
 * however its one property is not mutable, since it returns an immutable dictionary which contains a type that is itself
 * immutable.
 */
export class EarningsHistoryYtd implements IEarningsHistoryYtd {
  readonly earnings: Map<IEarningsDetails, IEarningsEntry>;

  /**
   * Initialises a new empty `EarningsHistoryYtd`.
   */
  constructor() {
    this.earnings = new Map<IEarningsDetails, IEarningsEntry>();
  }

  /**
   * Applies the supplied earnings to the current instance.
   *
   * @param earnings IEnumerable of earnings to apply.
   * @returns A reference to the current history, as a convenience.
   */
  public apply(earnings: Iterable<IEarningsEntry>): IEarningsHistoryYtd {
    for (const entry of earnings) {
      if (
        EmployeePayrollHistoryYtd.isReclaimableStatutoryPayment(
          entry.earningsDetails.paymentType,
        )
      ) {
        continue;
      }

      const existingEntry = this.earnings.get(entry.earningsDetails);
      if (existingEntry) {
        this.earnings.set(entry.earningsDetails, existingEntry.add(entry));
      } else {
        this.earnings.set(entry.earningsDetails, entry);
      }
    }

    return this;
  }
}
