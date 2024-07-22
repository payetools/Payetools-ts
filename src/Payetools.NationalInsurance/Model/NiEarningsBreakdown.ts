// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";

/// Represents the breakdown of earnings against each of the relevant National Insurance thresholds.
export class NiEarningsBreakdown {
  /**
   * Gets the earnings at the Lower Earnings Limit for this record. All earnings below the LEL are
   * disregarded.
   */
  earningsAtLEL: Money;

  /**
   * Gets the earnings up above the Lower Earnings Limit and up to and including the Secondary Threshold
   * for this record.
   */
  earningsAboveLELUpToAndIncludingST: Money;

  /**
   * Gets the earnings up above the Secondary Threshold and up to and including the Primary Threshold
   * for this record.
   */
  earningsAboveSTUpToAndIncludingPT: Money;

  /**
   * Gets the earnings up above the Primary Threshold and up to and including the Freeport Upper Secondary
   * Threshold for this record.
   */
  earningsAbovePTUpToAndIncludingFUST: Money;

  /**
   * Gets the earnings up above the Freeport Upper Secondary Threshold and up to and including the Upper
   * Earnings Limit for this record.
   */
  earningsAboveFUSTUpToAndIncludingUEL: Money;

  /**
   * Gets the earnings up above the Upper Earnings Limit for this record.
   */
  earningsAboveUEL: Money;

  /**
   * Gets the earnings up above the Secondary Threshold and up to and including the Upper Earnings Limit
   * for this record.
   */
  earningsAboveSTUpToAndIncludingUEL: Money;

  constructor(
    earningsAtLEL: Money = zeroGbp,
    earningsAboveLELUpToAndIncludingST: Money = zeroGbp,
    earningsAboveSTUpToAndIncludingPT: Money = zeroGbp,
    earningsAbovePTUpToAndIncludingFUST: Money = zeroGbp,
    earningsAboveFUSTUpToAndIncludingUEL: Money = zeroGbp,
    earningsAboveUEL: Money = zeroGbp,
    earningsAboveSTUpToAndIncludingUEL: Money = zeroGbp,
  ) {
    this.earningsAtLEL = earningsAtLEL;
    this.earningsAboveLELUpToAndIncludingST =
      earningsAboveLELUpToAndIncludingST;
    this.earningsAboveSTUpToAndIncludingPT = earningsAboveSTUpToAndIncludingPT;
    this.earningsAbovePTUpToAndIncludingFUST =
      earningsAbovePTUpToAndIncludingFUST;
    this.earningsAboveFUSTUpToAndIncludingUEL =
      earningsAboveFUSTUpToAndIncludingUEL;
    this.earningsAboveUEL = earningsAboveUEL;
    this.earningsAboveSTUpToAndIncludingUEL =
      earningsAboveSTUpToAndIncludingUEL;
  }
}
