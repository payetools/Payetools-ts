// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { JsonObject, JsonProperty } from "json2typescript";
import { zeroGbp } from "~/CurrencyHelpers";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";

/**
 * Represents a set of student loan thresholds, expressed per week, per month and per year.
 */
@JsonObject("StudentLoanThresholdsEntry")
export class StudentLoanThresholdsEntry {
  /**
   * Gets the per week threshold for student or post-grad loan deductions.
   */
  @JsonProperty("perWeek", MoneyJsonConverter)
  thresholdValuePerWeek: Money;

  /**
   * Gets the per month threshold for student or post-grad loan deductions.
   */
  @JsonProperty("perMonth", MoneyJsonConverter)
  thresholdValuePerMonth: Money;

  /**
   * Gets the per year threshold for student or post-grad loan deductions.
   */
  @JsonProperty("perYear", MoneyJsonConverter)
  thresholdValuePerYear: Money;

  constructor() {
    this.thresholdValuePerWeek = zeroGbp;
    this.thresholdValuePerMonth = zeroGbp;
    this.thresholdValuePerYear = zeroGbp;
  }
}
