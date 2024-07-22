// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { NiThresholdType } from "../Model/NiThresholdType";
import { INiThresholdEntry } from "./INiThresholdEntry";

/**
 * Interface for types that represent a list of National Insurance thresholds as defined by HMRC for a given
 * tax year or portion of a tax year. The list isn't specifically ordered; the items within the list provide
 * their own mapping to {@link NiThresholdType} values.
 */
export interface INiThresholdSet extends Array<INiThresholdEntry> {
  /**
   * Gets the number of threshold value this threshold set contains.
   */
  count: number;

  /**
   * Gets the annual threshold for the period for the specified threshold type.
   * @param thresholdType - Applicable threshold (e.g., LEL, UEL, PT).
   * @returns Annual threshold value applicable to threshold type.
   */
  getThreshold(thresholdType: NiThresholdType): Money;
}
