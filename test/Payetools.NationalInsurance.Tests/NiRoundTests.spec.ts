// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import Big from "big.js";
import { expect, test } from "vitest";
import { DecimalNiRoundingExtensions } from "~/Payetools.NationalInsurance/Extensions/DecimalNiRoundingExtensions";

/**
 * Testing the following expected behaviour:
 *
 * Rounds a decimal value based on the value of the third digit after the decimal point. If the value of the third digit is 6 or above,
 * the number is rounded up to the nearest whole pence; if the value of the third digit is 5 or below, the number is rounded down.
 *
 * Throws ArgumentOutOfRangeException if a negative number is supplied for value.
 */

test("CheckNegativeNumberExceptionThrown", () => {
  const input = Big(-1.2345);

  expect(() => DecimalNiRoundingExtensions.niRound(input)).toThrowError(
    "decimal.NiRound() only supports rounding of positive numbers (Parameter 'value')",
  );
});

test("CheckZeroInput", () => {
  const input = Big(0.0);

  expect(DecimalNiRoundingExtensions.niRound(input).toNumber()).toBe(0.0);
});

test("CheckThirdDigitZeroInput", () => {
  const input = Big(123.05);

  expect(DecimalNiRoundingExtensions.niRound(input).toNumber()).toBe(123.05);
});

test("CheckThirdDigitFiveInput", () => {
  const input = Big(123.055);

  expect(DecimalNiRoundingExtensions.niRound(input).toNumber()).toBe(123.05);
});

test("CheckThirdDigitSixInput", () => {
  const input = Big(123.056);

  expect(DecimalNiRoundingExtensions.niRound(input).toNumber()).toBe(123.06);
});

test("CheckFourthDigitNineInput", () => {
  const input = Big(123.0559);

  expect(DecimalNiRoundingExtensions.niRound(input).toNumber()).toBe(123.05);
});
