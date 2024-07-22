// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect } from "vitest";
import {
  PayFrequency,
  PayFrequencyExtensions,
} from "~/Payetools.Common/Model/PayFrequency";

describe("PayFrequencyTests", () => {
  it("TestTaxYearPeriodCounts", () => {
    expect(
      PayFrequencyExtensions.getStandardTaxPeriodCount(PayFrequency.Weekly),
    ).toBe(52);
    expect(
      PayFrequencyExtensions.getStandardTaxPeriodCount(
        PayFrequency.Fortnightly,
      ),
    ).toBe(26);
    expect(
      PayFrequencyExtensions.getStandardTaxPeriodCount(PayFrequency.FourWeekly),
    ).toBe(13);
    expect(
      PayFrequencyExtensions.getStandardTaxPeriodCount(PayFrequency.Monthly),
    ).toBe(12);
    expect(
      PayFrequencyExtensions.getStandardTaxPeriodCount(PayFrequency.Quarterly),
    ).toBe(4);
    expect(
      PayFrequencyExtensions.getStandardTaxPeriodCount(PayFrequency.BiAnnually),
    ).toBe(2);
    expect(
      PayFrequencyExtensions.getStandardTaxPeriodCount(PayFrequency.Annually),
    ).toBe(1);

    const action = () => {
      PayFrequencyExtensions.getStandardTaxPeriodCount(
        PayFrequency.Unspecified,
      );
    };

    expect(action).toThrowError(
      new Error(
        "Invalid pay frequency value Unspecified (Parameter 'payFrequency')",
      ),
    );
  });
});
