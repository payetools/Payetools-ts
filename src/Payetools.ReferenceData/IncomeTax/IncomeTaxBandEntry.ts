// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CountriesForTaxPurposes } from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import { TaxBandwidthEntry } from "~/Payetools.IncomeTax/ReferenceData/TaxBandwidthEntry";
import { IncomeTaxDeductionBand } from "./IncomeTaxDeductionBand";
import { PersonalAllowance } from "./PersonalAllowance";
import { JsonObject, JsonProperty } from "json2typescript";
import { CountriesForTaxPurposesJsonConverter } from "~/Payetools.Common/Serialization/CountriesForTaxPurposesJsonConverter";

/**
 * Record that represents a set of tax bands for a given tax regime (as specified by the `applicableCountries` property).
 */
@JsonObject("IncomeTaxBandEntry")
export class IncomeTaxBandEntry {
  /**
   * Gets the set of countries within the UK that this set of tax bands refer to.
   */
  @JsonProperty("applicableCountries", CountriesForTaxPurposesJsonConverter)
  public applicableCountries: CountriesForTaxPurposes =
    CountriesForTaxPurposes.None;

  /**
   * Gets the set of personal allowances applicable to this tax regime.
   */
  @JsonProperty("personalAllowances", [PersonalAllowance])
  public personalAllowances: PersonalAllowance[] = [];

  /**
   * Gets the set of tax bands applicable.
   */
  @JsonProperty("taxBands", [IncomeTaxDeductionBand])
  public taxBands: IncomeTaxDeductionBand[] = [];

  /**
   * Gets an array of `TaxBandwidthEntry`s that correspond to the elements of the `taxBands` property.
   * @returns {TaxBandwidthEntry[]} Tax bandwidth entries as an array of `TaxBandwidthEntry`s.
   */
  public getTaxBandwidthEntries(): TaxBandwidthEntry[] {
    const taxBandwidthEntries: TaxBandwidthEntry[] = new Array(
      this.taxBands.length,
    );

    for (let i = 0; i < this.taxBands.length; i++) {
      taxBandwidthEntries[i] = new TaxBandwidthEntry(
        this.taxBands[i].description,
        this.taxBands[i].rate,
        this.taxBands[i].to?.amount() ?? null,
        this.taxBands[i].isTopRate,
        i > 0 ? taxBandwidthEntries[i - 1] : null,
      );
    }

    return taxBandwidthEntries;
  }
}
