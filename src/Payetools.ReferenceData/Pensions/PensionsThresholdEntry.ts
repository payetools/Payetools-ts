// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { JsonObject, JsonProperty } from "json2typescript";
import { zeroGbp } from "~/CurrencyHelpers";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";
import { IPensionsThresholdEntry } from "~/Payetools.Pensions/ReferenceData/IPensionsThresholdEntry";

/**
 * Represents a given set of pensions threshold values.
 */
@JsonObject("PensionsThresholdEntry")
export class PensionsThresholdEntry implements IPensionsThresholdEntry {
  /**
   * Gets the per week value of the threshold.
   */
  @JsonProperty("perWeek", MoneyJsonConverter)
  thresholdValuePerWeek: Money = zeroGbp;

  /**
   * Gets the per 2-week value of the threshold.
   */
  @JsonProperty("perTwoWeeks", MoneyJsonConverter)
  thresholdValuePerTwoWeeks: Money = zeroGbp;

  /**
   * Gets the per 4-week value of the threshold.
   */
  @JsonProperty("perFourWeeks", MoneyJsonConverter)
  thresholdValuePerFourWeeks: Money = zeroGbp;

  /**
   * Gets the per month value of the threshold.
   */
  @JsonProperty("perMonth", MoneyJsonConverter)
  thresholdValuePerMonth: Money = zeroGbp;

  /**
   * Gets the per quarter value of the threshold.
   */
  @JsonProperty("perQuarter", MoneyJsonConverter)
  thresholdValuePerQuarter: Money = zeroGbp;

  /**
   * Gets the per half-year value of the threshold.
   */
  @JsonProperty("perHalfYear", MoneyJsonConverter)
  thresholdValuePerHalfYear: Money = zeroGbp;

  /**
   * Gets the per annum value of the threshold.
   */
  @JsonProperty("perYear", MoneyJsonConverter)
  thresholdValuePerYear: Money = zeroGbp;

  /**
   * Gets the applicable threshold value for the supplied pay frequency.
   * @param payFrequency - Applicable pay frequency.
   * @returns Applicable threshold value for the supplied pay frequency.
   */
  getThresholdForPayFrequency(payFrequency: PayFrequency): Money {
    switch (payFrequency) {
      case PayFrequency.Weekly:
        return this.thresholdValuePerWeek;
      case PayFrequency.Fortnightly:
        return this.thresholdValuePerTwoWeeks;
      case PayFrequency.FourWeekly:
        return this.thresholdValuePerFourWeeks;
      case PayFrequency.Monthly:
        return this.thresholdValuePerMonth;
      case PayFrequency.Quarterly:
        return this.thresholdValuePerQuarter;
      case PayFrequency.BiAnnually:
        return this.thresholdValuePerHalfYear;
      case PayFrequency.Annually:
        return this.thresholdValuePerYear;
      default:
        throw new Error("Invalid pay frequency supplied");
    }
  }
}
