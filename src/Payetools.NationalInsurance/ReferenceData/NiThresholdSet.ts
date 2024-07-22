// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import {
  NationalInsuranceThresholdExtensions,
  NiThresholdType,
} from "../Model/NiThresholdType";
import { INiThresholdEntry } from "./INiThresholdEntry";
import { INiThresholdSet } from "./INiThresholdSet";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { ArgumentException } from "~/Payetools.Common/Diagnostics/ArgumentException";
import { getNiThresholdTypesForTaxYear } from "./TaxYearSpecificConfiguration";
import { RoundUp, gbp } from "~/CurrencyHelpers";

/**
 * Represents a set of National Insurance thresholds as defined by HMRC for a given tax year or portion of a tax year.
 */
export class NiThresholdSet
  extends Array<INiThresholdEntry>
  implements INiThresholdSet
{
  //private readonly niThresholds: INiThresholdEntry[];

  /**
   * Gets the number of threshold value this threshold set contains.
   */
  get count(): number {
    return this.length;
  }

  /**
   * Gets the INiThresholdEntry at the specified index.
   * @param index Zero-based index into list.
   * @returns The INiThresholdEntry for the specified index.
   */
  public getThresholdEntry(index: number): INiThresholdEntry {
    if (index < 0 || index > this.length - 1) {
      throw new RangeError("Invalid index value for retrieving NI threshold");
    }
    return this[index];
  }

  /**
   * Initializes a new instance of NiThresholdSet.
   * @param niThresholds Immutable input list of thresholds.
   * @throws {Error} Thrown if the number of thresholds supplied does not match the expected
   * number of possible thresholds.
   */
  public static fromThresholds(
    niThresholds: INiThresholdEntry[],
    taxYearEnding: TaxYearEnding,
  ): NiThresholdSet {
    const expectedThresholds = getNiThresholdTypesForTaxYear(taxYearEnding);
    if (
      niThresholds.some((t) => !expectedThresholds.has(t.thresholdType)) ||
      expectedThresholds.size !== niThresholds.length
    ) {
      throw new ArgumentException(
        `Mismatch between expected ${expectedThresholds.size} threshold entries and actual ${niThresholds.length} threshold entries for tax year ending ${taxYearEnding}`,
        "niThresholds",
      );
    }
    return new NiThresholdSet(...niThresholds);
  }

  public static fromProRata(
    originalAnnualNiThresholds: INiThresholdSet,
    proRataFactor: Big,
  ): NiThresholdSet {
    const newThresholds = originalAnnualNiThresholds.map((t) => ({
      thresholdType: t.thresholdType,
      thresholdValuePerYear: gbp(
        t.thresholdValuePerYear.amount().mul(proRataFactor).round(0, RoundUp),
      ),
    }));
    return new NiThresholdSet(...newThresholds);
  }

  /**
   * Gets the annual threshold for the period for the specified threshold type.
   * @param thresholdType Applicable threshold (e.g., LEL, UEL, PT).
   * @returns Annual threshold value applicable to threshold type.
   */
  public getThreshold(thresholdType: NiThresholdType): Money {
    return this[NationalInsuranceThresholdExtensions.getIndex(thresholdType)]
      .thresholdValuePerYear;
  }

  /**
   * Gets a string representation of this NiPeriodThresholdSet.
   * @returns String representation of this instance.
   */
  public toString(): string {
    return this.map((te) => te.toString()).join(" | ");
  }

  // /**
  //  * Returns an enumerator that iterates through the thresholds (of type INiThresholdEntry).
  //  * @returns An enumerator that can be used to iterate through the collection of thresholds.
  //  * @throws {Error} Throw if the enumerator cannot be obtained.  (Should never be thrown).
  //  */
  // public *getEnumerator(): IterableIterator<INiThresholdEntry> {
  //     for (const threshold of this) {
  //         yield threshold;
  //     }
  // }

  // /**
  //  * Returns an enumerator that iterates through the thresholds (of type INiThresholdEntry).
  //  * @returns An enumerator that can be used to iterate through the collection of thresholds.
  //  * @throws {Error} Throw if the enumerator cannot be obtained.  (Should never be thrown).
  //  */
  // [Symbol.iterator](): IterableIterator<INiThresholdEntry> {
  //     return this.getEnumerator();
  // }
}
