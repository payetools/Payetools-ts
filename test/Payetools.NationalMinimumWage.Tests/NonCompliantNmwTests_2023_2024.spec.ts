// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, beforeEach, test, expect } from "vitest";
import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { INmwEvaluator } from "~/Payetools.NationalMinimumWage/INmwEvaluator";
import { NmwEvaluatorFactoryDataFixture } from "./NmwEvaluatorFactoryDataFixture";
import { Money } from "@dintero/money";
import { CalendarDate } from "calendar-date";
import { RoundHalfUp, gbp } from "~/CurrencyHelpers";
import { DateOnlyExtensions } from "~/Payetools.Common/Extensions/DateOnlyExtensions";
import Big from "big.js";

describe("NonCompliantNmwTests_2023_2024", () => {
  const payDate = new PayDate(2023, 5, 5, PayFrequency.Monthly);
  let factoryProviderFixture: NmwEvaluatorFactoryDataFixture;
  const expectedHourlyNmwRates: Money[] = [
    gbp(5.28),
    gbp(5.28),
    gbp(7.49),
    gbp(10.18),
    gbp(10.42),
  ];
  const ApprenticeLevelIndex = 0;
  const Under18LevelIndex = 1;
  const Age18To20Level = 2;
  const Age21To22Level = 3;
  const Age23AndAboveLevel = 4;

  beforeEach(() => {
    factoryProviderFixture = new NmwEvaluatorFactoryDataFixture();
  });

  test("Test23OrOverAsync", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2023, 4, 1),
      new CalendarDate(2023, 4, 30),
    );
    let dateOfBirth = new CalendarDate(2000, 4, 1);
    const hoursWorked = 24.0;
    let hourlyRate = Big(10.4179);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Age23AndAboveLevel],
    );

    dateOfBirth = new CalendarDate(2000, 3, 31);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Age23AndAboveLevel],
    );

    hourlyRate = Big(10.42);
    grossPay = hourlyRate.mul(hoursWorked).sub(0.01);
    dateOfBirth = new CalendarDate(1951, 3, 31);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Age23AndAboveLevel],
    );
  });

  test("Test21To22Async", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2023, 8, 10),
      new CalendarDate(2023, 9, 9),
    );
    let dateOfBirth = new CalendarDate(2002, 8, 10);
    const hoursWorked = 40.0;
    const hourlyRate = Big(10.18);
    let grossPay = hourlyRate.mul(hoursWorked).sub(0.01);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Age21To22Level],
    );

    grossPay = grossPay.sub(0.01);
    dateOfBirth = new CalendarDate(2000, 8, 11);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Age21To22Level],
    );
  });

  test("Test18To20Async", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2024, 1, 1),
      new CalendarDate(2024, 1, 31),
    );
    let dateOfBirth = new CalendarDate(2006, 1, 1);
    const hoursWorked = 35.0;
    const hourlyRate = Big(7.49);
    let grossPay = hourlyRate.mul(hoursWorked).sub(0.01);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Age18To20Level],
    );

    grossPay = grossPay.sub(0.01);
    dateOfBirth = new CalendarDate(2004, 1, 2);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Age18To20Level],
    );
  });

  test("TestUnder18NonApprenticeAsync", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2024, 3, 5),
      new CalendarDate(2024, 4, 5),
    );
    let dateOfBirth = new CalendarDate(2007, 3, 6);
    const hoursWorked = 17.5;
    const hourlyRate = Big(5.28);
    let grossPay = hourlyRate.mul(hoursWorked).sub(0.01);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Under18LevelIndex],
    );

    grossPay = grossPay.sub(0.01);
    dateOfBirth = new CalendarDate(2006, 3, 6);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Under18LevelIndex],
    );
  });

  test("TestApprenticeAsync", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2024, 3, 5),
      new CalendarDate(2024, 4, 5),
    );
    let dateOfBirth = new CalendarDate(2006, 3, 6);
    const hoursWorked = 17.5;
    const hourlyRate = Big(5.2799);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Under18LevelIndex],
      true,
      1.0,
    );

    dateOfBirth = new CalendarDate(2005, 3, 5);

    await runInvalidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[Under18LevelIndex],
      true,
      0.99,
    );
  });

  const runInvalidNmwTestAsync = async (
    payPeriod: DateRange,
    dateOfBirth: CalendarDate,
    hoursWorked: number,
    grossPay: Big,
    expectedAge: number,
    expectedRate: Money,
    isApprentice = false,
    yearsAsApprentice?: number,
  ) => {
    const evaluator = await getEvaluator();
    const hourlyRate = Big(grossPay.div(hoursWorked).round(4, RoundHalfUp));

    const result = evaluator.evaluate(
      payPeriod,
      dateOfBirth,
      grossPay,
      hoursWorked,
      isApprentice,
      yearsAsApprentice,
    );

    expect(result.ageAtStartOfPayPeriod).toBe(expectedAge);
    expect(result.isCompliant).toBe(false);
    expect(result.nmwLevelApplied?.toNumber()).toBe(expectedRate.toNumber());

    if (isApprentice && (expectedAge < 19 || (yearsAsApprentice ?? 0) < 1.0)) {
      const apprenticeText =
        expectedAge >= 19
          ? "Treated as apprentice 19 or over but in the first year of their apprenticeship"
          : "Treated as apprentice under 19";
      expect(result.commentary).toBe(
        `Age at start of pay period = ${expectedAge}. ${apprenticeText}. Pay is non-compliant as gross pay per hour of ${hourlyRate} is less than minimum NMW/NLW rate ${expectedRate}`,
      );
    } else
      expect(result.commentary).toBe(
        `Age at start of pay period = ${expectedAge}. Pay is non-compliant as gross pay per hour of ${hourlyRate} is less than minimum NMW/NLW rate ${expectedRate}`,
      );
  };

  const getEvaluator = async (): Promise<INmwEvaluator> => {
    const provider = await factoryProviderFixture.getFactory();

    return provider.getEvaluator(payDate);
  };
});
