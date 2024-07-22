// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import Big from "big.js";
import { JsonObject, JsonProperty } from "json2typescript";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";

/**
 * Record that details a single tax band for a given tax regime.
 */
@JsonObject("IncomeTaxDeductionBand")
export class IncomeTaxDeductionBand {
  /**
   * Gets the description of this tax band.
   */
  @JsonProperty("description", String)
  description: string = "";

  /**
   * Gets the taxable earnings threshold from which this tax band applies.
   */
  @JsonProperty("from", MoneyJsonConverter, true)
  from?: Money;

  /**
   * Gets the taxable earnings threshold up to which this tax band applies.
   */
  @JsonProperty("to", MoneyJsonConverter, true)
  to?: Money;

  /**
   * Gets the applicable tax rate.  NB Tax rates are normally expressed as percentages;
   * values here are fractional i.e., 20% = 0.2.
   */
  @JsonProperty("rate", BigJsonConverter)
  rate: Big = Big(0);

  /**
   * Gets a value indicating whether this band refers to the bottom rate of tax.
   */
  get isBottomRate(): boolean {
    return this.from == null;
  }

  /**
   * Gets a value indicating whether this band refers to the top rate of tax.
   */
  get isTopRate(): boolean {
    return this.to == null;
  }
}
