// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { describe, it, expect } from "vitest";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

describe("PayDateTests", () => {
  it("TestConstructors", () => {
    let date = new CalendarDate(2022, 5, 5);
    let payDate = new PayDate(date, PayFrequency.Monthly);
    expect(payDate.taxPeriod).toBe(1);
    expect(payDate.taxYear.taxYearEnding).toBe(TaxYearEnding.Apr5_2023);

    date = new CalendarDate(2022, 4, 5);
    payDate = new PayDate(date, PayFrequency.Monthly);
    expect(payDate.taxPeriod).toBe(12);
    expect(payDate.taxYear.taxYearEnding).toBe(TaxYearEnding.Apr5_2022);

    date = new CalendarDate(2023, 4, 4);
    payDate = new PayDate(date, PayFrequency.Weekly);
    expect(payDate.taxPeriod).toBe(52);
    expect(payDate.taxYear.taxYearEnding).toBe(TaxYearEnding.Apr5_2023);

    date = new CalendarDate(2023, 4, 5);
    payDate = new PayDate(date, PayFrequency.Weekly);
    expect(payDate.taxPeriod).toBe(53);
    expect(payDate.taxYear.taxYearEnding).toBe(TaxYearEnding.Apr5_2023);

    date = new CalendarDate(2021, 12, 31);
    payDate = new PayDate(date, PayFrequency.Monthly);
    expect(payDate.taxPeriod).toBe(9);
    expect(payDate.taxYear.taxYearEnding).toBe(TaxYearEnding.Apr5_2022);
  });

  it("TestInvalidPayDates", () => {
    let date = new CalendarDate(2018, 4, 5);
    let action = () => new PayDate(date, PayFrequency.Monthly);

    expect(action).toThrowError(
      new RangeError(
        "Unsupported tax year; date must fall within range tax year ending 6 April 2019 to 6 April 2025 (Parameter 'date')",
      ),
    );

    date = new CalendarDate(2025, 4, 6);
    action = () => new PayDate(date, PayFrequency.Monthly);

    expect(action).toThrowError(
      new RangeError(
        "Unsupported tax year; date must fall within range tax year ending 6 April 2019 to 6 April 2025 (Parameter 'date')",
      ),
    );
  });

  it("TestWeekOrMonthNumber", () => {
    let payDate = new PayDate(
      new CalendarDate(2022, 5, 5),
      PayFrequency.Monthly,
    );
    let periodNumber: number;
    let isWeekly: boolean;
    ({ periodNumber, isWeekly } = payDate.getWeekOrMonthNumber());
    expect(isWeekly).toBe(false);
    expect(periodNumber).toBe(1);

    payDate = new PayDate(new CalendarDate(2022, 5, 6), PayFrequency.Monthly);
    ({ periodNumber, isWeekly } = payDate.getWeekOrMonthNumber());
    expect(isWeekly).toBe(false);
    expect(periodNumber).toBe(2);

    payDate = new PayDate(new CalendarDate(2022, 5, 6), PayFrequency.Quarterly);
    ({ periodNumber, isWeekly } = payDate.getWeekOrMonthNumber());
    expect(isWeekly).toBe(false);
    expect(periodNumber).toBe(3);

    payDate = new PayDate(new CalendarDate(2023, 4, 13), PayFrequency.Weekly);
    ({ periodNumber, isWeekly } = payDate.getWeekOrMonthNumber());
    expect(isWeekly).toBe(true);
    expect(periodNumber).toBe(2);

    payDate = new PayDate(new CalendarDate(2024, 4, 5), PayFrequency.Weekly);
    ({ periodNumber, isWeekly } = payDate.getWeekOrMonthNumber());
    expect(isWeekly).toBe(true);
    expect(periodNumber).toBe(53);

    payDate = new PayDate(
      new CalendarDate(2023, 5, 18),
      PayFrequency.Fortnightly,
    );
    ({ periodNumber, isWeekly } = payDate.getWeekOrMonthNumber());
    expect(isWeekly).toBe(true);
    expect(periodNumber).toBe(8);

    payDate = new PayDate(
      new CalendarDate(2023, 11, 16),
      PayFrequency.FourWeekly,
    );
    ({ periodNumber, isWeekly } = payDate.getWeekOrMonthNumber());
    expect(isWeekly).toBe(true);
    expect(periodNumber).toBe(36);
  });
});
