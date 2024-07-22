// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { NiThresholdType } from "../Model/NiThresholdType";

/**
 * Record that represents a given National Insurance threshold across various pay frequencies. Note
 * that HMRC guidance is that only the annual threshold should be used for calculations; weekly and
 * monthly thresholds are given for information only.
 */
export class NiThresholdEntry {
  /**
   * Gets the type of threshold this instance pertains to.
   */
  thresholdType: NiThresholdType;

  /**
   * Gets the per annum value of the threshold.
   */
  thresholdValuePerYear: Money;

  constructor(thresholdType: NiThresholdType, thresholdValuePerYear: Money) {
    this.thresholdType = thresholdType;
    this.thresholdValuePerYear = thresholdValuePerYear;
  }

  /**
   * Gets the string representation of this `NiThresholdEntry` for debugging purposes.
   * @returns String representation of this instance.
   */
  toString(): string {
    return `{ ${this.thresholdType}: ${this.thresholdValuePerYear} p.a. }`;
  }
}
