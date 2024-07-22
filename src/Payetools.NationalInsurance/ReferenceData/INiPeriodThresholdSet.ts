// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { NiThresholdType } from "../Model/NiThresholdType";
import { INiThresholdSet } from "./INiThresholdSet";

/**
 * Interface that represents a set of NI thresholds that have been adjusted to a proportion of the tax year.
 */
export interface INiPeriodThresholdSet extends INiThresholdSet {
  /**
   * Gets the modified threshold for the period (as distinct from the value returned by {@link getThreshold1})
   * where rounding is applied based on whether the pay frequency is weekly or monthly, or otherwise. As detailed in
   * HMRC's NI calculation documentation as 'p1'.
   *
   * @param thresholdType - Applicable threshold (e.g., LEL, UEL, PT).
   * @returns Pro-rata threshold value applicable to the period and threshold type.
   */
  getThreshold1(thresholdType: NiThresholdType): Money;
}
