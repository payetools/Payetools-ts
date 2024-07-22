// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonObject, JsonProperty } from "json2typescript";
import { zeroGbp } from "~/CurrencyHelpers";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";

/**
 * Represents a single tax bandwidth entry for a full tax year.  For example, in the UK for 2021-2022, the starter rate of tax
 * for Scottish taxpayers was 19%, from zero taxable earnings up to £2,097.  This information constitutes a single TaxBandwidthEntry.
 */
@JsonObject("TaxBandwidthEntry")
export class TaxBandwidthEntry {
  /**
   * Gets the descriptive text associated with this TaxBandwidthEntry.
   */
  @JsonProperty("description", String)
  public description: string;

  /**
   * Gets the bandwidth of this TaxBandwidthEntry, i.e., the upper threshold less any lower threshold.
   */
  public get bandwidth(): Big {
    return this.cumulativeBandwidth.sub(
      this.bandWidthEntryBelow?.cumulativeBandwidth ?? zeroGbp.amount(),
    );
  }

  /**
   * Gets or sets the cumulative bandwidth of this TaxBandwidthEntry, i.e., the sum of this bandwidth and all bandwidths below.
   */
  @JsonProperty("cumulativeBandwidth", BigJsonConverter)
  public cumulativeBandwidth: Big;

  /**
   * Gets the applicable tax rate for this TaxBandwidthEntry.
   */
  @JsonProperty("rate", BigJsonConverter)
  public rate: Big;

  /**
   * Gets or sets the tax due in a single tax year for just this TaxBandwidthEntry if it is fully used.
   */
  @JsonProperty("taxForBand", BigJsonConverter)
  public taxForBand: Big;

  /**
   * Gets or sets the tax due in a single tax year for this TaxBandwidthEntry and all bandwidths below, assuming they are all fully used.
   */
  @JsonProperty("cumulativeTax", BigJsonConverter)
  public cumulativeTax: Big;

  /**
   * Gets a value indicating whether this TaxBandwidthEntry represents the top band of tax for this tax regime.
   */
  @JsonProperty("isTopBand", Boolean)
  public isTopBand: boolean;

  /**
   * Gets the TaxBandwidthEntry that is immediately below this TaxBandwidthEntry, or null if this is the lowest TaxBandwidthEntry
   * for this tax regime.
   */
  @JsonProperty("bandWidthEntryBelow", TaxBandwidthEntry)
  public bandWidthEntryBelow?: TaxBandwidthEntry;

  /**
   * Initialises a new instance of TaxBandwidthEntry with the supplied parameters.
   * @param bandDescription Descriptive text associated with this TaxBandwidthEntry.
   * @param taxBandRate Applicable tax rate for this TaxBandwidthEntry.
   * @param taxBandTo Upper threshold for this TaxBandwidthEntry.
   * @param isTopRate True if this is the top TaxBandwidthEntry for the tax regime in question.
   * @param entryBelow TaxBandwidthEntry immediately below this TaxBandwidthEntry, if applicable; null otherwise.
   */
  constructor(
    bandDescription: string,
    taxBandRate: Big,
    taxBandTo: Big | null,
    isTopRate: boolean,
    entryBelow: TaxBandwidthEntry | null,
  ) {
    this.description = bandDescription;
    this.rate = taxBandRate;
    this.cumulativeBandwidth = taxBandTo ?? zeroGbp.amount();

    const bandwith = this.cumulativeBandwidth.sub(
      entryBelow?.cumulativeBandwidth ?? zeroGbp.amount(),
    );
    this.taxForBand = bandwith.mul(taxBandRate);

    this.cumulativeTax = isTopRate
      ? zeroGbp.amount()
      : this.taxForBand.add(entryBelow?.cumulativeTax ?? zeroGbp.amount());
    this.isTopBand = isTopRate;

    this.bandWidthEntryBelow = entryBelow ?? undefined;
  }
}
