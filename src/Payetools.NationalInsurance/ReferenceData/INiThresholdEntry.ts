// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { NiThresholdType } from "../Model/NiThresholdType";

/**
 * Interface for types that provide access to a given NI threshold value.
 */
export interface INiThresholdEntry {
  /**
   * Gets the type of threshold this instance pertains to.
   */
  thresholdType: NiThresholdType;

  /**
   * Gets the per annum value of the threshold.
   */
  thresholdValuePerYear: Money;
}
