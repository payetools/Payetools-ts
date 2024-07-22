// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect } from "vitest";
import { CalendarDate } from "calendar-date";
import { DateOnlyExtensions } from "~/Payetools.Common/Extensions/DateOnlyExtensions";

describe("DateOnlyExtensionTests", () => {
  it("TestAgeAtCalculations", () => {
    let date = new CalendarDate(2022, 1, 1);
    let dateOfBirth = new CalendarDate(2000, 1, 1);
    expect(DateOnlyExtensions.ageAt(dateOfBirth, date)).toBe(22);

    date = new CalendarDate(2022, 12, 31);
    dateOfBirth = new CalendarDate(2000, 1, 1);
    expect(DateOnlyExtensions.ageAt(dateOfBirth, date)).toBe(22);

    date = new CalendarDate(2023, 1, 1);
    dateOfBirth = new CalendarDate(2000, 1, 1);
    expect(DateOnlyExtensions.ageAt(dateOfBirth, date)).toBe(23);

    date = new CalendarDate(2023, 2, 28);
    dateOfBirth = new CalendarDate(2000, 2, 28);
    expect(DateOnlyExtensions.ageAt(dateOfBirth, date)).toBe(23);

    date = new CalendarDate(2023, 2, 28);
    dateOfBirth = new CalendarDate(2000, 2, 29);
    expect(DateOnlyExtensions.ageAt(dateOfBirth, date)).toBe(22);

    date = new CalendarDate(2023, 3, 1);
    dateOfBirth = new CalendarDate(2000, 2, 29);
    expect(DateOnlyExtensions.ageAt(dateOfBirth, date)).toBe(23);
  });
});
