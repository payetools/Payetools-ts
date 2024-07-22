// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { JsonObject, JsonProperty } from "json2typescript";
import { NiThresholdType } from "~/Payetools.NationalInsurance/Model/NiThresholdType";
import { INiThresholdEntry } from "~/Payetools.NationalInsurance/ReferenceData/INiThresholdEntry";
import { NiThresholdTypeJsonConverter } from "../Serialization/NiThresholdTypeJsonConverter";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";

/**
 * Record that represents a given National Insurance threshold across various pay frequencies. Note
 * that HMRC guidance is that only the annual threshold should be used for calculations; weekly and
 * monthly thresholds are given for information only.
 */
@JsonObject("NiReferenceDataThresholdEntry")
export class NiReferenceDataThresholdEntry implements INiThresholdEntry {
  /**
   * Gets the applicable threshold's name. This name is mapped to the relevant {@link NiThresholdType} as
   * part of the deserialization process.
   */
  @JsonProperty("thresholdName", NiThresholdTypeJsonConverter)
  thresholdType: NiThresholdType;

  /**
   * Gets the per week value of the threshold.
   */
  @JsonProperty("perWeek", MoneyJsonConverter)
  thresholdValuePerWeek: Money;

  /**
   * Gets the per month value of the threshold.
   */
  @JsonProperty("perMonth", MoneyJsonConverter, true)
  thresholdValuePerMonth?: Money;

  /**
   * Gets the per year value of the threshold.
   */
  @JsonProperty("perYear", MoneyJsonConverter)
  thresholdValuePerYear: Money;

  constructor(
    thresholdType: NiThresholdType,
    thresholdValuePerWeek: Money,
    thresholdValuePerMonth: Money,
    thresholdValuePerYear: Money,
  ) {
    this.thresholdType = thresholdType;
    this.thresholdValuePerWeek = thresholdValuePerWeek;
    this.thresholdValuePerMonth = thresholdValuePerMonth;
    this.thresholdValuePerYear = thresholdValuePerYear;
  }
}
