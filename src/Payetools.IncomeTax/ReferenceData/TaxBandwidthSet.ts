// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonObject, JsonProperty } from "json2typescript";
import { TaxBandwidthEntry } from "./TaxBandwidthEntry";

/**
 * Represents a set of tax bandwidths for a given tax regime for a given tax year.
 */
@JsonObject("TaxBandwidthSet")
export class TaxBandwidthSet {
  /**
   * Gets the set of `TaxBandwidthEntry`'s for this TaxBandwidthSet as an array.
   */
  @JsonProperty("taxBandwidthEntries", [TaxBandwidthEntry])
  public taxBandwidthEntries: TaxBandwidthEntry[];

  /**
   * Initialises a new instance of `TaxBandwidthSet`.
   * @param taxBandwidthEntries Array of `TaxBandwidthEntry`'s for this tax year/regime combination.
   */
  constructor(taxBandwidthEntries: TaxBandwidthEntry[]) {
    this.taxBandwidthEntries = taxBandwidthEntries;
  }
}
