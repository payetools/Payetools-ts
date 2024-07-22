/**
 * Copyright (c) 2023-2024, Payetools Foundation.
 *
 * Payetools Foundation licenses this file to you under the following license(s):
 *
 *   * The MIT License, see https://opensource.org/license/mit/
 */

import { expect, test, describe } from "vitest";
import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { NmwEvaluatorFactoryDataFixture } from "./NmwEvaluatorFactoryDataFixture";
import { Money } from "@dintero/money";
import { RoundHalfUp, gbp } from "~/CurrencyHelpers";
import { CalendarDate } from "calendar-date";
import { DateOnlyExtensions } from "~/Payetools.Common/Extensions/DateOnlyExtensions";
import { INmwEvaluator } from "~/Payetools.NationalMinimumWage/INmwEvaluator";
import Big from "big.js";

describe("CompliantNmwTests_2023_2024", () => {
  const _payDate = new PayDate(2023, 5, 5, PayFrequency.Monthly);
  const _factoryProviderFixture = new NmwEvaluatorFactoryDataFixture();
  const _expectedHourlyNmwRates: Money[] = [
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

  test("Test23OrOverAsync", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2023, 4, 1),
      new CalendarDate(2023, 4, 30),
    );
    let dateOfBirth = new CalendarDate(2000, 4, 1);
    let hoursWorked = 24.0;
    let hourlyRate = Big(10.42);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[Age23AndAboveLevel],
    );

    dateOfBirth = new CalendarDate(2000, 3, 31);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[Age23AndAboveLevel],
    );

    hoursWorked = 23.9;
    dateOfBirth = new CalendarDate(1951, 3, 31);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[Age23AndAboveLevel],
    );
  });

  test("Test21To22Async", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2023, 8, 10),
      new CalendarDate(2023, 9, 9),
    );
    let dateOfBirth = new CalendarDate(2002, 8, 10);
    let hoursWorked = 40.0;
    let hourlyRate = Big(10.18);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[Age21To22Level],
    );

    grossPay = grossPay.add(0.01);
    dateOfBirth = new CalendarDate(2000, 8, 11);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[Age21To22Level],
    );
  });

  test("Test18To20Async", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2024, 1, 1),
      new CalendarDate(2024, 1, 31),
    );
    let dateOfBirth = new CalendarDate(2006, 1, 1);
    let hoursWorked = 35.0;
    let hourlyRate = Big(7.49);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[Age18To20Level],
    );

    grossPay = grossPay.add(0.01);
    dateOfBirth = new CalendarDate(2003, 1, 2);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[Age18To20Level],
    );
  });

  test("TestUnder18NonApprenticeAsync", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2023, 3, 5),
      new CalendarDate(2024, 4, 5),
    );
    let dateOfBirth = new CalendarDate(2007, 3, 6);
    let hoursWorked = 17.5;
    let hourlyRate = Big(5.28);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[Under18LevelIndex],
    );

    grossPay = grossPay.add(0.01);
    dateOfBirth = new CalendarDate(2005, 3, 6);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[Under18LevelIndex],
    );
  });

  test("TestApprenticeAsync", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2024, 3, 5),
      new CalendarDate(2024, 4, 5),
    );
    let dateOfBirth = new CalendarDate(2005, 3, 6);
    let hoursWorked = 17.5;
    let hourlyRate = Big(5.28);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[ApprenticeLevelIndex],
      true,
      1.0,
    );

    grossPay = grossPay.add(0.01);
    dateOfBirth = new CalendarDate(2004, 3, 5);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      _expectedHourlyNmwRates[ApprenticeLevelIndex],
      true,
      0.99,
    );
  });

  async function runValidNmwTestAsync(
    payPeriod: DateRange,
    dateOfBirth: CalendarDate,
    hoursWorked: number,
    grossPay: Big,
    expectedAge: number,
    expectedRate: Money,
    isApprentice: boolean = false,
    yearsAsApprentice: number | null = null,
  ) {
    const evaluator = await getEvaluator();
    const hourlyRate = grossPay.div(hoursWorked).round(4, RoundHalfUp);

    const result = evaluator.evaluate(
      payPeriod,
      dateOfBirth,
      grossPay,
      hoursWorked,
      isApprentice,
      yearsAsApprentice,
    );

    expect(result.ageAtStartOfPayPeriod).toBe(expectedAge);
    expect(result.isCompliant).toBe(true);
    expect(result.nmwLevelApplied?.toNumber()).toBe(expectedRate.toNumber());

    if (isApprentice && (expectedAge < 19 || yearsAsApprentice! < 1.0)) {
      const apprenticeText =
        expectedAge >= 19
          ? "Treated as apprentice 19 or over but in the first year of their apprenticeship"
          : "Treated as apprentice under 19";
      expect(result.commentary).toBe(
        `Age at start of pay period = ${expectedAge}. ${apprenticeText}. Pay is compliant as gross pay per hour of ${hourlyRate.toFixed(4)} is greater than or equal to minimum NMW/NLW rate ${expectedRate}`,
      );
    } else {
      expect(result.commentary).toBe(
        `Age at start of pay period = ${expectedAge}. Pay is compliant as gross pay per hour of ${hourlyRate.toFixed(4)} is greater than or equal to minimum NMW/NLW rate ${expectedRate}`,
      );
    }
  }

  async function getEvaluator(): Promise<INmwEvaluator> {
    const provider = await _factoryProviderFixture.getFactory();
    return provider.getEvaluator(_payDate);
  }
});
