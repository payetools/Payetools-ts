// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import {
  NationalInsuranceThresholdExtensions,
  NiThresholdType,
} from "../Model/NiThresholdType";
import { INiPeriodThresholdSet } from "./INiPeriodThresholdSet";
import { INiThresholdEntry } from "./INiThresholdEntry";
import { INiThresholdSet } from "./INiThresholdSet";
import { NiPeriodThresholdEntry } from "./NiPeriodThresholdEntry";
import { Money } from "@dintero/money";

/**
 * Represents a set of NI thresholds that have been adjusted to a proportion of the tax year.
 */
export class NiPeriodThresholdSet
  extends Array<INiThresholdEntry>
  implements INiPeriodThresholdSet
{
  private readonly thresholdEntries: NiPeriodThresholdEntry[];

  /**
   * Initialises a new instance of `NiPeriodThresholdSet` based on the supplied annual thresholds, the
   * applicable pay frequency and the applicable number of tax periods.
   * @param entries Set of National Insurance thresholds as defined by HMRC for a given tax year (or portion
   * of a tax year, when there are in-year changes).
   * @param payFrequency Applicable pay frequency.
   * @param numberOfTaxPeriods Number of tax periods, if applicable.  Defaults to 1.
   */
  constructor(
    entries: INiThresholdSet,
    payFrequency: PayFrequency,
    numberOfTaxPeriods: number = 1,
  ) {
    super(0);
    const entryCount = entries.count;

    this.thresholdEntries = new Array(entryCount);

    for (let index = 0; index < entryCount; index++) {
      this.thresholdEntries[
        NationalInsuranceThresholdExtensions.getIndex(
          entries[index].thresholdType,
        )
      ] = new NiPeriodThresholdEntry(
        entries[index],
        payFrequency,
        numberOfTaxPeriods,
      );
    }
  }

  /**
   * Gets the number of threshold value this threshold set contains.
   */
  get count(): number {
    return this.thresholdEntries.length;
  }

  /**
   * Gets the base threshold for the period, as distinct from the value returned by `getThreshold1` (see below).
   * @param thresholdType Applicable threshold (e.g., LEL, UEL, PT).
   * @returns Pro-rata threshold value applicable to the period and threshold type.
   */
  getThreshold(thresholdType: NiThresholdType): Money {
    return this.thresholdEntries[
      NationalInsuranceThresholdExtensions.getIndex(thresholdType)
    ].thresholdForPeriod;
  }

  /**
   * Gets the modified threshold for the period (as distinct from the value returned by `getThreshold1`)
   * where rounding is applied based on whether the pay frequency is weekly or monthly, or otherwise.  As detailed in
   * HMRC's NI calculation documentation as 'p1'.
   * @param thresholdType Applicable threshold (e.g., LEL, UEL, PT).
   * @returns Pro-rata threshold value applicable to the period and threshold type.
   */
  getThreshold1(thresholdType: NiThresholdType): Money {
    return this.thresholdEntries[
      NationalInsuranceThresholdExtensions.getIndex(thresholdType)
    ].thresholdForPeriod1;
  }

  /**
   * Gets a string representation of this `NiPeriodThresholdSet`.
   * @returns String representation of this instance.
   */
  toString(): string {
    return this.thresholdEntries.map((te) => te.toString()).join(" | ");
  }

  // /**
  //  * Returns an enumerator that iterates through the thresholds (of type `INiThresholdEntry`).
  //  * @returns An enumerator that can be used to iterate through the collection of thresholds.
  //  * @throws InvalidOperationException Throw if the enumerator cannot be obtained.  (Should never be thrown).
  //  */
  // *[Symbol.iterator](): Iterator<INiThresholdEntry> {
  //     for (const entry of this.thresholdEntries) {
  //         yield entry;
  //     }
  // }
}
