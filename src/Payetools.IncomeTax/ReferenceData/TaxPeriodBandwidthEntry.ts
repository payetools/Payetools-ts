// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import {
  PayFrequency,
  PayFrequencyExtensions,
} from "~/Payetools.Common/Model/PayFrequency";
import { TaxBandwidthEntry } from "./TaxBandwidthEntry";
import { JsonObject, JsonProperty } from "json2typescript";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";
import { RoundDown, RoundHalfEven } from "~/CurrencyHelpers";

/**
 * Represents a single tax bandwidth entry for a portion of a tax year.  For example, in the UK for 2021-2022, the starter rate of tax
 * for Scottish taxpayers was 19%, from zero taxable earnings up to £2,097.  In simple terms, this bandwidth is distributed evenly across
 * the tax year, so in tax period 1 for a monthly payroll, the bandwidth would be £2,097 / 12 = £174.75.  All other parameters are
 * adjusted accordingly in line with the tax period.  This information constitutes a single {@link TaxPeriodBandwidthEntry}.
 */
@JsonObject("TaxPeriodBandwidthEntry")
export class TaxPeriodBandwidthEntry extends TaxBandwidthEntry {
  /**
   * Gets the numeric index of this {@link TaxPeriodBandwidthEntry} within its {@link TaxPeriodBandwidthSet}.  Zero-based,
   * with 0 being the lowest tax band.
   */
  @JsonProperty("entryIndex", Number)
  public entryIndex: number;

  /**
   * Gets the cumulative bandwidth value for tax period 1.
   */
  @JsonProperty("cumulativeBandwidth", BigJsonConverter)
  public period1CumulativeBandwidth: Big;

  /**
   * Gets the cumulative tax value for tax period 1.
   */
  @JsonProperty("cumulativeTax", BigJsonConverter)
  public period1CumulativeTax: Big;

  /**
   * Gets the {@link TaxPeriodBandwidthEntry} that is immediately below this TaxPeriodBandwidthEntry, or null if this is
   * the lowest TaxPeriodBandwidthEntry for this tax regime.
   */
  @JsonProperty("bandWidthEntryBelow", TaxPeriodBandwidthEntry)
  public bandWidthEntryBelow?: TaxPeriodBandwidthEntry;

  /**
   * Initialises a new instance of {@link TaxPeriodBandwidthEntry} with the supplied parameters.
   * @param index Zero-based numeric index of this {@link TaxPeriodBandwidthEntry} within its
   * {@link TaxPeriodBandwidthSet}.
   * @param annualEntry Corresponding annual tax bandwidth entry, i.e., {@link TaxBandwidthEntry}.
   * @param payFrequency Pay frequency for this TaxPeriodBandwidthEntry.
   * @param taxPeriod Tax period, e.g., 1-12 for monthly.
   * @param periodEntryBelow {@link TaxPeriodBandwidthEntry} immediately below this one, or null if this is the lowest band.
   */
  constructor(
    bandDescription: string,
    taxBandRate: Big,
    taxBandTo: Big | null,
    isTopRate: boolean,
    entryBelow: TaxBandwidthEntry | null,
    index: number,
    annualEntry: TaxBandwidthEntry,
    payFrequency: PayFrequency,
    taxPeriod: number,
    periodEntryBelow?: TaxPeriodBandwidthEntry,
  ) {
    super(bandDescription, taxBandRate, taxBandTo, isTopRate, entryBelow);
    this.entryIndex = index;

    const payPeriodCount =
      PayFrequencyExtensions.getStandardTaxPeriodCount(payFrequency);

    const periodFactor = taxPeriod / payPeriodCount;

    this.cumulativeBandwidth = this.applyRounding(
      annualEntry.cumulativeBandwidth.mul(periodFactor),
    );
    this.cumulativeTax = this.applyRounding(
      annualEntry.cumulativeTax.mul(periodFactor),
    );
    this.taxForBand = this.applyRounding(
      annualEntry.taxForBand.mul(periodFactor),
    );

    this.period1CumulativeBandwidth = this.applyRounding(
      annualEntry.cumulativeBandwidth.div(payPeriodCount),
    );
    this.period1CumulativeTax = this.applyRounding(
      annualEntry.cumulativeTax.div(payPeriodCount),
    );

    this.bandWidthEntryBelow = periodEntryBelow;
  }

  // The HMRC specification calls for rounding down to 4 dp.  However, due to decimal arithmetic precision
  // limits, results like 1.9999999999 arise which should really be treated as 2, so the inner Round function
  // ensures this treatment.
  private applyRounding(value: Big): Big {
    return value.round(10, RoundHalfEven).round(4, RoundDown);
  }
}
