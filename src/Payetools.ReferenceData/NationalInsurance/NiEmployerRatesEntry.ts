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
@JsonObject("NiEmployerRatesEntry")
export class NiEmployerRatesEntry {
  /**
   * Gets the list of applicable NI categories for this rates entry.
   */
  @JsonProperty("niCategories", NiCategoryJsonConverter)
  niCategories: NiCategory[];

  /**
   * Gets the employer rate applicable for earnings between the Lower Earnings
   * Limit and the Secondary Threshold.
   */
  @JsonProperty("forEarningsAtOrAboveLELUpToAndIncludingST", BigJsonConverter)
  forEarningsAtOrAboveLELUpToAndIncludingST: Big;

  /**
   * Gets the employer rate applicable for earnings between the Secondary Threshold
   * and the Freeport Upper Secondary Threshold.
   */
  @JsonProperty("forEarningsAboveSTUpToAndIncludingFUST", BigJsonConverter)
  forEarningsAboveSTUpToAndIncludingFUST: Big;

  /**
   * Gets the employer rate applicable for earnings between the Freeport Upper
   * Secondary Threshold and the Upper Earnings Limit or any applicable Upper
   * Secondary Threshold.
   */
  @JsonProperty(
    "forEarningsAboveFUSTUpToAndIncludingUELOrUST",
    BigJsonConverter,
  )
  forEarningsAboveFUSTUpToAndIncludingUELOrUST: Big;

  /**
   * Gets the employer rate applicable for earnings above the Upper Earnings Limit.
   */
  @JsonProperty("forEarningsAboveUELOrUST", BigJsonConverter)
  forEarningsAboveUELOrUST: Big;

  constructor(
    niCategories: NiCategory[],
    forEarningsAtOrAboveLelUpToAndIncludingSt: Big,
    forEarningsAboveStUpToAndIncludingFust: Big,
    forEarningsAboveFustUpToAndIncludingUelOrUst: Big,
    forEarningsAboveUelOrUst: Big,
  ) {
    this.niCategories = niCategories;
    this.forEarningsAtOrAboveLELUpToAndIncludingST =
      forEarningsAtOrAboveLelUpToAndIncludingSt;
    this.forEarningsAboveSTUpToAndIncludingFUST =
      forEarningsAboveStUpToAndIncludingFust;
    this.forEarningsAboveFUSTUpToAndIncludingUELOrUST =
      forEarningsAboveFustUpToAndIncludingUelOrUst;
    this.forEarningsAboveUELOrUST = forEarningsAboveUelOrUst;
  }
}
