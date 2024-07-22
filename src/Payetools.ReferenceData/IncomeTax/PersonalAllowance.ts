// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { JsonObject, JsonProperty } from "json2typescript";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";
import { PayFrequencyJsonConverter } from "~/Payetools.Common/Serialization/PayFrequencyJsonConverter";

/**
 * Represents a given personal allowance value for a specific pay frequency.
 */
@JsonObject("PersonalAllowance")
export class PersonalAllowance {
  /**
   * Gets the pay frequency applicable to this personal allowance value.
   */
  @JsonProperty("payFrequency", PayFrequencyJsonConverter)
  payFrequency: PayFrequency;

  /**
   * Gets the personal allowance value for this pay frequency.
   */
  @JsonProperty("value", MoneyJsonConverter)
  value: Money;

  constructor(payFrequency: PayFrequency, value: Money) {
    this.payFrequency = payFrequency;
    this.value = value;
  }
}
