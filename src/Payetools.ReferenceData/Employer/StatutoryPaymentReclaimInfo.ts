// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { JsonObject, JsonProperty } from "json2typescript";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";

/**
 * Represents the reference data needed to determine the amounts that can be reclaimed against
 * statutory payments (e.g., SMP, SPP, etc).
 */
@JsonObject("StatutoryPaymentReclaimInfo")
export class StatutoryPaymentReclaimInfo {
  /**
   * Gets the threshold up to which employers are eligible for Small Employers Relief.
   */
  @JsonProperty("smallEmployerReliefThreshold", MoneyJsonConverter)
  smallEmployerReliefThreshold: Money;

  /**
   * Gets the rate (as a decimal) at which employers can reclaim eligible statutory payments, if
   * they are not entitled to Small Employers Relief.
   */
  @JsonProperty("defaultReclaimRate", BigJsonConverter)
  defaultReclaimRate: Big;

  /**
   * Gets the rate (as a decimal) at which employers can reclaim eligible statutory payments if
   * they are entitled to Small Employers Relief.
   */
  @JsonProperty("smallEmployersReclaimRate", BigJsonConverter)
  smallEmployersReclaimRate: Big;

  constructor(
    smallEmployerReliefThreshold: Money,
    defaultReclaimRate: Big,
    smallEmployersReclaimRate: Big,
  ) {
    this.smallEmployerReliefThreshold = smallEmployerReliefThreshold;
    this.defaultReclaimRate = defaultReclaimRate;
    this.smallEmployersReclaimRate = smallEmployersReclaimRate;
  }
}
