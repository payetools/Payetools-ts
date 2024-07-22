// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { describe, it, expect } from "vitest";
import { DateOnlyExtensions } from "~/Payetools.Common/Extensions/DateOnlyExtensions";
import {
  TaxYearEnding,
  TaxYearEndingExtensions,
} from "~/Payetools.Common/Model/TaxYearEnding";

describe("TaxYearEndingTests", () => {
  it("TestSpecificTaxYear", () => {
    let date = new CalendarDate(2020, 4, 5);
    let ending = DateOnlyExtensions.toTaxYearEnding(date);
    expect(ending).toBe(TaxYearEnding.Apr5_2020);

    date = new CalendarDate(2020, 4, 6);
    ending = DateOnlyExtensions.toTaxYearEnding(date);
    expect(ending).toBe(TaxYearEnding.Apr5_2021);

    date = new CalendarDate(2022, 5, 5);
    ending = DateOnlyExtensions.toTaxYearEnding(date);
    expect(ending).toBe(TaxYearEnding.Apr5_2023);
  });

  it("TestUnsupportedTaxYears", () => {
    expect(() =>
      DateOnlyExtensions.toTaxYearEnding(
        new CalendarDate(TaxYearEnding.MinValue - 1, 1, 1),
      ),
    ).toThrowError(
      new RangeError(
        `Unsupported tax year; date must fall within range tax year ending 6 April ${TaxYearEnding.MinValue} to 6 April ${TaxYearEnding.MaxValue} (Parameter 'date')`,
      ),
    );

    expect(() =>
      DateOnlyExtensions.toTaxYearEnding(
        new CalendarDate(TaxYearEnding.MaxValue + 1, 1, 1),
      ),
    ).toThrowError(
      new RangeError(
        `Unsupported tax year; date must fall within range tax year ending 6 April ${TaxYearEnding.MinValue} to 6 April ${TaxYearEnding.MaxValue} (Parameter 'date')`,
      ),
    );
  });

  it("TestTaxYearEndingExtensions", () => {
    let taxYearEnding = TaxYearEnding.Apr5_2019;
    expect(TaxYearEndingExtensions.yearAsString(taxYearEnding)).toBe("2019");

    taxYearEnding = TaxYearEnding.Apr5_2022;
    expect(TaxYearEndingExtensions.yearAsString(taxYearEnding)).toBe("2022");
  });
});
