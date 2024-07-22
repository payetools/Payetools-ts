// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect } from "vitest";
import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { INmwEvaluator } from "~/Payetools.NationalMinimumWage/INmwEvaluator";
import { NmwEvaluatorFactoryDataFixture } from "./NmwEvaluatorFactoryDataFixture";
import { CalendarDate } from "calendar-date";
import { DateOnlyExtensions } from "~/Payetools.Common/Extensions/DateOnlyExtensions";
import { RoundHalfUp, RoundUp, gbp } from "~/CurrencyHelpers";
import { Money } from "@dintero/money";
import Big from "big.js";

/**
 * Compliant NMW Tests for 2022-2023
 */
describe("CompliantNmwTests_2022_2023", () => {
  const payDate = new PayDate(2022, 5, 5, PayFrequency.Monthly);
  const factoryProviderFixture = new NmwEvaluatorFactoryDataFixture();
  const expectedHourlyNmwRates: Money[] = [
    gbp(4.81),
    gbp(4.81),
    gbp(6.83),
    gbp(9.18),
    gbp(9.5),
  ];
  const apprenticeLevelIndex = 0;
  const under18LevelIndex = 1;
  const age18To20Level = 2;
  const age21To22Level = 3;
  const age23AndAboveLevel = 4;

  it("Test23OrOverAsync", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2022, 4, 1),
      new CalendarDate(2022, 4, 30),
    );
    let dateOfBirth = new CalendarDate(1999, 4, 1);
    let hoursWorked = 24.0;
    let hourlyRate = Big(9.5);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[age23AndAboveLevel],
    );

    dateOfBirth = new CalendarDate(1999, 3, 31);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[age23AndAboveLevel],
    );

    hoursWorked = 23.9;
    dateOfBirth = new CalendarDate(1950, 3, 31);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[age23AndAboveLevel],
    );
  });

  it("Test21To22Async", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2022, 8, 10),
      new CalendarDate(2022, 9, 9),
    );
    let dateOfBirth = new CalendarDate(2001, 8, 10);
    let hoursWorked = 40.0;
    let hourlyRate = Big(9.18);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[age21To22Level],
    );

    grossPay = grossPay.add(0.01);
    dateOfBirth = new CalendarDate(1999, 8, 11);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[age21To22Level],
    );
  });

  it("Test18To20Async", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2023, 1, 1),
      new CalendarDate(2023, 1, 31),
    );
    let dateOfBirth = new CalendarDate(2005, 1, 1);
    let hoursWorked = 35.0;
    let hourlyRate = Big(6.83);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[age18To20Level],
    );

    grossPay = grossPay.add(0.01);
    dateOfBirth = new CalendarDate(2003, 1, 2);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[age18To20Level],
    );
  });

  it("TestUnder18NonApprenticeAsync", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2023, 3, 5),
      new CalendarDate(2023, 4, 5),
    );
    let dateOfBirth = new CalendarDate(2006, 3, 6);
    let hoursWorked = 17.5;
    let hourlyRate = Big(4.81);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[under18LevelIndex],
    );

    grossPay = grossPay.add(0.01);
    dateOfBirth = new CalendarDate(2005, 3, 6);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[under18LevelIndex],
    );
  });

  it("TestApprenticeAsync", async () => {
    const payPeriod = new DateRange(
      new CalendarDate(2023, 3, 5),
      new CalendarDate(2023, 4, 5),
    );
    let dateOfBirth = new CalendarDate(2004, 3, 6);
    let hoursWorked = 17.5;
    let hourlyRate = Big(4.81);
    let grossPay = hourlyRate.mul(hoursWorked);

    await runValidNmwTestAsync(
      payPeriod,
      dateOfBirth,
      hoursWorked,
      grossPay,
      DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start),
      expectedHourlyNmwRates[apprenticeLevelIndex],
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
      expectedHourlyNmwRates[apprenticeLevelIndex],
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
    const provider = await factoryProviderFixture.getFactory();
    return provider.getEvaluator(payDate);
  }
});
