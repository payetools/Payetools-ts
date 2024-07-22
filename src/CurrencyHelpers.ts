/**
 * RoundDown = 0, RoundHalfUp = 1, RoundHalfEven = 2, RoundUp = 3
 */

import { Money } from "@dintero/money";

export const RoundDown = 0;
export const RoundHalfUp = 1;
export const RoundHalfEven = 2;
export const RoundUp = 3;

export const zeroGbp = Money.of(0, "GBP");

export const gbp = (amount: number | string | Big) => Money.of(amount, "GBP");

export const gbpMaybe = (amount?: number | string | Big) =>
  amount == null ? undefined : Money.of(amount, "GBP");
