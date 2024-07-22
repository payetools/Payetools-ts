// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxBandwidthSet } from "./TaxBandwidthSet";
import { TaxPeriodBandwidthEntry } from "./TaxPeriodBandwidthEntry";
import { IterableExtensions } from "~/Payetools.Common/Extensions/IEnumerableExtensions";
import { JsonObject, JsonProperty } from "json2typescript";
import { PayFrequencyJsonConverter } from "~/Payetools.Common/Serialization/PayFrequencyJsonConverter";

/**
 * Represents a set of tax bandwidths for a given tax regime for a given tax year, pro-rated for a given tax period.  For
 * Example, for weekly payrolls and relating to tax period one, the cumulative thresholds and tax values are calculated as
 * 1/52th of the annual amount.
 */
@JsonObject("TaxPeriodBandwidthSet")
export class TaxPeriodBandwidthSet {
  /**
   * Gets the set of tax bandwidth entries for the given tax regime, tax year and tax period/pay frequency
   * combination, as an array of {@link TaxPeriodBandwidthEntry}'s.
   */
  @JsonProperty("taxBandwidthEntries", [TaxPeriodBandwidthEntry])
  public taxBandwidthEntries: TaxPeriodBandwidthEntry[];

  /**
   * Gets the relevant tax period for this {@link TaxPeriodBandwidthSet}.
   */
  @JsonProperty("taxPeriod", Number)
  public taxPeriod: number;

  /**
   * Gets the applicable pay frequency for this {@link TaxPeriodBandwidthSet}.
   */
  @JsonProperty("payFrequency", PayFrequencyJsonConverter)
  public payFrequency: PayFrequency;

  /**
   * Initialises a new instance of {@link TaxPeriodBandwidthSet} with the supplied parameters.
   * @param annualTaxBandwidthSet Tax bandwidth set for the full tax year.
   * @param payFrequency Applicable pay frequency.
   * @param taxPeriod Relevant tax period.
   */
  constructor(
    annualTaxBandwidthSet: TaxBandwidthSet,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ) {
    this.payFrequency = payFrequency;
    this.taxPeriod = taxPeriod;

    const annualEntries = annualTaxBandwidthSet.taxBandwidthEntries;
    this.taxBandwidthEntries = new Array<TaxPeriodBandwidthEntry>(
      annualEntries.length,
    );

    for (const tbe of IterableExtensions.withIndex(annualEntries)) {
      const tbeBelow =
        tbe.index > 0 ? this.taxBandwidthEntries[tbe.index - 1] : undefined;

      this.taxBandwidthEntries[tbe.index] = new TaxPeriodBandwidthEntry(
        tbe.value.description,
        tbe.value.rate,
        tbe.value.cumulativeBandwidth,
        tbe.value.isTopBand,
        tbe.value.bandWidthEntryBelow ?? null,
        tbe.index,
        tbe.value,
        payFrequency,
        taxPeriod,
        tbeBelow,
      );
    }
  }
}
