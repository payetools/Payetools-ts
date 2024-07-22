// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IEarningsDetails } from "./IEarningsDetails";
import { IEarningsEntry } from "./IEarningsEntry";

/**
 * Interface that represents an employee's earnings history for the tax year to date.
 *
 * Note that this type is mutable (via the apply method;
 * however its one property is not mutable, since it returns an immutable map which contains a type that is itself
 * immutable.
 */
export interface IEarningsHistoryYtd {
  /**
   * Gets a map of earnings year to date keyed on earnings details.
   */
  readonly earnings: Map<IEarningsDetails, IEarningsEntry>;

  /**
   * Applies the supplied earnings to the current instance.
   * @param earnings Iterable of earnings to apply.
   * @returns A reference to the current history, as a convenience.
   */
  apply(earnings: Iterable<IEarningsEntry>): IEarningsHistoryYtd;
}
