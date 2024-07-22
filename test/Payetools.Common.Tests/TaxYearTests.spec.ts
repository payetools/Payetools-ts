/**
 * Copyright (c) 2023-2024, Payetools Foundation.
 *
 * Payetools Foundation licenses this file to you under the following license(s):
 *
 *   * The MIT License, see https://opensource.org/license/mit/
 */

import { CalendarDate } from "calendar-date";
import { expect, test } from "vitest";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

test("TestConstructFromDate", () => {
  let date = new CalendarDate(2020, 5, 5);
  let taxYear = TaxYear.fromTaxYearEnding(date);
  expect(taxYear.taxYearEnding).toBe(TaxYearEnding.Apr5_2021);

  date = new CalendarDate(2022, 4, 5);
  taxYear = TaxYear.fromTaxYearEnding(date);
  expect(taxYear.taxYearEnding).toBe(TaxYearEnding.Apr5_2022);

  date = new CalendarDate(2022, 4, 6);
  taxYear = TaxYear.fromTaxYearEnding(date);
  expect(taxYear.taxYearEnding).toBe(TaxYearEnding.Apr5_2023);
});

test("TestMonthlyTaxPeriod", () => {
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 4, 6),
    PayFrequency.Monthly,
    1,
    -1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2023,
    new CalendarDate(2022, 5, 5),
    PayFrequency.Monthly,
    1,
    -1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2019,
    new CalendarDate(2018, 5, 6),
    PayFrequency.Monthly,
    2,
    -1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 12, 31),
    PayFrequency.Monthly,
    9,
    -1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2020,
    new CalendarDate(2020, 1, 5),
    PayFrequency.Monthly,
    9,
    -1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2021,
    new CalendarDate(2021, 1, 6),
    PayFrequency.Monthly,
    10,
    -1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2021,
    new CalendarDate(2021, 2, 15),
    PayFrequency.Monthly,
    11,
    -1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 3, 20),
    PayFrequency.Monthly,
    12,
    -1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 4, 5),
    PayFrequency.Monthly,
    12,
    -1,
  );
});

test("TestWeeklyTaxPeriod", () => {
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 4, 6),
    PayFrequency.Weekly,
    1,
    0,
    1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2023,
    new CalendarDate(2022, 5, 5),
    PayFrequency.Weekly,
    5,
    0,
    1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2019,
    new CalendarDate(2018, 5, 15),
    PayFrequency.Weekly,
    6,
    0,
    2,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 12, 31),
    PayFrequency.Weekly,
    39,
    0,
    9,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2020,
    new CalendarDate(2020, 1, 5),
    PayFrequency.Weekly,
    40,
    0,
    9,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2021,
    new CalendarDate(2021, 1, 6),
    PayFrequency.Weekly,
    40,
    0,
    10,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2021,
    new CalendarDate(2021, 2, 15),
    PayFrequency.Weekly,
    46,
    0,
    11,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 3, 20),
    PayFrequency.Weekly,
    50,
    0,
    12,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 4, 3),
    PayFrequency.Weekly,
    52,
    0,
    12,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 4, 5),
    PayFrequency.Weekly,
    53,
    0,
    12,
  );
});

test("TestTwoWeeklyTaxPeriod", () => {
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 4, 6),
    PayFrequency.Fortnightly,
    1,
    2,
    1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2023,
    new CalendarDate(2022, 5, 5),
    PayFrequency.Fortnightly,
    3,
    6,
    1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2019,
    new CalendarDate(2018, 5, 15),
    PayFrequency.Fortnightly,
    3,
    6,
    2,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 12, 31),
    PayFrequency.Fortnightly,
    20,
    40,
    9,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2020,
    new CalendarDate(2020, 1, 5),
    PayFrequency.Fortnightly,
    20,
    40,
    9,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2021,
    new CalendarDate(2021, 1, 11),
    PayFrequency.Fortnightly,
    21,
    42,
    10,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2020,
    new CalendarDate(2020, 2, 29),
    PayFrequency.Fortnightly,
    24,
    48,
    11,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 3, 20),
    PayFrequency.Fortnightly,
    25,
    50,
    12,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 4, 3),
    PayFrequency.Fortnightly,
    26,
    52,
    12,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 4, 5),
    PayFrequency.Fortnightly,
    27,
    54,
    12,
  );
});

test("TestFourWeeklyTaxPeriod", () => {
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 4, 6),
    PayFrequency.FourWeekly,
    1,
    4,
    1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2023,
    new CalendarDate(2022, 5, 5),
    PayFrequency.FourWeekly,
    2,
    8,
    1,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2019,
    new CalendarDate(2018, 6, 1),
    PayFrequency.FourWeekly,
    3,
    12,
    2,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 12, 31),
    PayFrequency.FourWeekly,
    10,
    40,
    9,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2020,
    new CalendarDate(2020, 1, 5),
    PayFrequency.FourWeekly,
    10,
    40,
    9,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2021,
    new CalendarDate(2021, 1, 11),
    PayFrequency.FourWeekly,
    11,
    44,
    10,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2020,
    new CalendarDate(2020, 2, 29),
    PayFrequency.FourWeekly,
    12,
    48,
    11,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 3, 20),
    PayFrequency.FourWeekly,
    13,
    52,
    12,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 4, 3),
    PayFrequency.FourWeekly,
    13,
    52,
    12,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 4, 5),
    PayFrequency.FourWeekly,
    14,
    56,
    12,
  );
});

test("TestQuarterlyTaxPeriod", () => {
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 4, 6),
    PayFrequency.Quarterly,
    1,
    -1,
    3,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2023,
    new CalendarDate(2022, 7, 5),
    PayFrequency.Quarterly,
    1,
    -1,
    3,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2019,
    new CalendarDate(2018, 7, 6),
    PayFrequency.Quarterly,
    2,
    -1,
    6,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 10, 5),
    PayFrequency.Quarterly,
    2,
    -1,
    6,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 10, 6),
    PayFrequency.Quarterly,
    3,
    -1,
    9,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2020,
    new CalendarDate(2020, 1, 5),
    PayFrequency.Quarterly,
    3,
    -1,
    9,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2021,
    new CalendarDate(2021, 1, 6),
    PayFrequency.Quarterly,
    4,
    -1,
    12,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2022, 4, 5),
    PayFrequency.Quarterly,
    4,
    -1,
    12,
  );
});

test("TestBiAnnuallyTaxPeriod", () => {
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 4, 6),
    PayFrequency.BiAnnually,
    1,
    -1,
    6,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 10, 5),
    PayFrequency.BiAnnually,
    1,
    -1,
    6,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2022,
    new CalendarDate(2021, 10, 6),
    PayFrequency.BiAnnually,
    2,
    -1,
    12,
  );
  runTaxPeriodTest(
    TaxYearEnding.Apr5_2020,
    new CalendarDate(2020, 4, 5),
    PayFrequency.BiAnnually,
    2,
    -1,
    12,
  );
});

test("TestInvalidTaxPeriod", () => {
  expect(() => {
    const taxYear = TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2022);
    const periodNumber = taxYear.getTaxPeriod(
      new CalendarDate(2022, 4, 6),
      PayFrequency.Monthly,
    );
  }).toThrowError(
    "Pay date of 06/04/2022 is outside this tax year 06/04/2021 - 05/04/2022 (Parameter 'payDate')",
  );
});

test("TestLastDateOfTaxPeriod", () => {
  const taxYear = TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2022);

  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.Weekly, 1)).toEqual(
    new CalendarDate(2021, 4, 12),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.Weekly, 2)).toEqual(
    new CalendarDate(2021, 4, 19),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.Fortnightly, 1)).toEqual(
    new CalendarDate(2021, 4, 19),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.Fortnightly, 2)).toEqual(
    new CalendarDate(2021, 5, 3),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.FourWeekly, 1)).toEqual(
    new CalendarDate(2021, 5, 3),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.Monthly, 1)).toEqual(
    new CalendarDate(2021, 5, 5),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.Monthly, 2)).toEqual(
    new CalendarDate(2021, 6, 5),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.Monthly, 3)).toEqual(
    new CalendarDate(2021, 7, 5),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.Monthly, 12)).toEqual(
    new CalendarDate(2022, 4, 5),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.Quarterly, 1)).toEqual(
    new CalendarDate(2021, 7, 5),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.BiAnnually, 1)).toEqual(
    new CalendarDate(2021, 10, 5),
  );
  expect(taxYear.getLastDayOfTaxPeriod(PayFrequency.Annually, 1)).toEqual(
    new CalendarDate(2022, 4, 5),
  );
});

function runTaxPeriodTest(
  taxYearEnding: TaxYearEnding,
  payDate: CalendarDate,
  payFrequency: PayFrequency,
  expectedPeriodNumber: number,
  expectedWeekNumber = 0,
  expectedMonthNumber = 0,
) {
  const taxYear = TaxYear.fromTaxYearEnding(taxYearEnding);
  const periodNumber = taxYear.getTaxPeriod(payDate, payFrequency);

  expect(periodNumber).toBe(expectedPeriodNumber);

  if (expectedWeekNumber !== -1) {
    const weekNumber = taxYear.getWeekNumber(payDate, payFrequency);

    const expWkNo =
      expectedWeekNumber !== 0 ? expectedWeekNumber : expectedPeriodNumber;
    expect(weekNumber).toBe(expWkNo);
  }

  const monthNumber = taxYear.getMonthNumber(payDate, payFrequency);

  const expMnthNo =
    expectedMonthNumber !== 0 ? expectedMonthNumber : expectedPeriodNumber;
  expect(monthNumber).toBe(expMnthNo);
}
