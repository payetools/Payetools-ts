// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";

/**
 * Interface for types that provide access to a given set of pensions threshold values.
 */
export interface IPensionsThresholdEntry {
  /**
   * Gets the per week value of the threshold.
   */
  thresholdValuePerWeek: Money;

  /**
   * Gets the per 2-week value of the threshold.
   */
  thresholdValuePerTwoWeeks: Money;

  /**
   * Gets the per 4-week value of the threshold.
   */
  thresholdValuePerFourWeeks: Money;

  /**
   * Gets the per month value of the threshold.
   */
  thresholdValuePerMonth: Money;

  /**
   * Gets the per quarter value of the threshold.
   */
  thresholdValuePerQuarter: Money;

  /**
   * Gets the per half-year value of the threshold.
   */
  thresholdValuePerHalfYear: Money;

  /**
   * Gets the per annum value of the threshold.
   */
  thresholdValuePerYear: Money;
}
