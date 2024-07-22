// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { JsonObject, JsonProperty } from "json2typescript";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";

/**
 * Represents the reference data needed to perform Apprentice Levy calculations.
 */
@JsonObject("ApprenticeLevyInfo")
export class ApprenticeLevyInfo {
  /**
   * Gets the threshold at which employers need to start paying the Apprentice Levy.
   */
  @JsonProperty("apprenticeLevyThreshold", MoneyJsonConverter)
  apprenticeLevyThreshold: Money;

  /**
   * Gets the allowance that employers get to offset their levy payments.
   */
  @JsonProperty("apprenticeLevyAllowance", MoneyJsonConverter)
  apprenticeLevyAllowance: Money;

  /**
   * Gets the rate (as a decimal) that employers must pay Apprentice Levy contributions at.
   */
  @JsonProperty("apprenticeLevyRate", MoneyJsonConverter)
  apprenticeLevyRate: Money;

  constructor(
    apprenticeLevyThreshold: Money,
    apprenticeLevyAllowance: Money,
    apprenticeLevyRate: Money,
  ) {
    this.apprenticeLevyThreshold = apprenticeLevyThreshold;
    this.apprenticeLevyAllowance = apprenticeLevyAllowance;
    this.apprenticeLevyRate = apprenticeLevyRate;
  }
}
