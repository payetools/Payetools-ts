// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { RoundDown, RoundHalfUp } from "~/CurrencyHelpers";
import { ArgumentException } from "~/Payetools.Common/Diagnostics/ArgumentException";

/**
 * Extension methods for number instances to provide specialised rounding as per HMRC documentation.
 */
export class DecimalNiRoundingExtensions {
  /**
   * Rounds a number value based on the value of the third digit after the decimal point. If the value of the third digit is 6 or above,
   * the number is rounded up to the nearest whole pence; if the value of the third digit is 5 or below, the number is rounded down.
   *
   * @param value number value to be rounded.
   * @returns Rounded number value.
   * @throws {RangeError} Thrown if a negative number is supplied for value.
   * @remarks This method is included to support the specific rounding required for NI calculations as set out
   * in the 'National Insurance contributions (NICs) guidance for software developers' document published by HMRC.
   */
  public static niRound(value: Big): Big {
    if (value.lt(0)) {
      throw new ArgumentException(
        "decimal.NiRound() only supports rounding of positive numbers",
        "value",
      );
    }

    const truncatedValue = value.round(2, RoundDown);
    const fractionsOfPence = value.round(3, RoundDown).minus(truncatedValue);

    return fractionsOfPence.lte(0.005)
      ? truncatedValue
      : value.round(2, RoundHalfUp);
  }
}
