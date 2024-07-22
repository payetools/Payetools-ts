// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonObject, JsonProperty } from "json2typescript";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { NiCategoryJsonConverter } from "../Serialization/NiCategoryJsonTypeConverter";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";

/**
 * Record that represents the employee NI rates to be applied at various earnings thresholds.
 */
@JsonObject("NiEmployeeRatesEntry")
export class NiEmployeeRatesEntry {
  /**
   * Gets the list of applicable NI categories for this rates entry.
   */
  @JsonProperty("niCategories", NiCategoryJsonConverter)
  niCategories: NiCategory[];

  /**
   * Gets the employee rate applicable for earnings between the Lower Earnings
   * Limit and the Primary Threshold.
   */
  @JsonProperty("forEarningsAtOrAboveLELUpTAndIncludingPT", BigJsonConverter)
  forEarningsAtOrAboveLELUpTAndIncludingPT: Big;

  /**
   * Gets the employee rate applicable for earnings between the Primary Threshold
   * and the Upper Earnings Limit.
   */
  @JsonProperty("forEarningsAbovePTUpToAndIncludingUEL", BigJsonConverter)
  forEarningsAbovePTUpToAndIncludingUEL: Big;

  /**
   * Gets the employee rate applicable for earnings above the Upper Earnings
   * Limit.
   */
  @JsonProperty("forEarningsAboveUEL", BigJsonConverter)
  forEarningsAboveUEL: Big;

  constructor(
    niCategories: NiCategory[],
    forEarningsAtOrAboveLelUpToAndIncludingPt: Big,
    forEarningsAbovePtUpToAndIncludingUel: Big,
    forEarningsAboveUel: Big,
  ) {
    this.niCategories = niCategories;
    this.forEarningsAtOrAboveLELUpTAndIncludingPT =
      forEarningsAtOrAboveLelUpToAndIncludingPt;
    this.forEarningsAbovePTUpToAndIncludingUEL =
      forEarningsAbovePtUpToAndIncludingUel;
    this.forEarningsAboveUEL = forEarningsAboveUel;
  }
}
