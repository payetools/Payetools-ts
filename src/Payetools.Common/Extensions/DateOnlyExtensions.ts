// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { PayDate } from "../Model/PayDate";
import { PayFrequency } from "../Model/PayFrequency";
import { TaxYearEnding } from "../Model/TaxYearEnding";
import { ArgumentOutOfRangeException } from "../Diagnostics/ArgumentOutOfRangeException";

/**
 * Extension methods for instances of Date.
 */
export class DateOnlyExtensions {
  /**
   * Provides an equivalent Date to the supplied Date with the
   * time portion set to midnight (00:00:00) and the DateTimeKind set to Unspecified. This is used to
   * minimise the possibility of DateTimes being misinterpreted as the next or previous day due to the
   * use of non-UTC timezones.
   * @param date Date to convert to DateTime.
   * @returns Date instance with the same date as the supplied Date and time portion set to 12:00:00 UTC.
   */
  static toDateTimeUnspecified(date: CalendarDate): Date {
    return new Date(date.year, date.month, date.day, 0, 0, 0, 0);
  }

  /**
   * Gets the TaxYearEnding value for the supplied Date.
   * @param date Date to get the TaxYearEnding for.
   * @returns Relevant TaxYearEnding for the supplied date.
   * @throws ArgumentOutOfRangeException Thrown if the supplied date is outside the supported
   * set of dates for this library.
   */
  static toTaxYearEnding(date: CalendarDate): TaxYearEnding {
    const apr6 = new CalendarDate(date.year, 4, 6);
    const taxYear = date.year + (date < apr6 ? 0 : 1);

    if (taxYear < TaxYearEnding.MinValue || taxYear > TaxYearEnding.MaxValue) {
      throw new ArgumentOutOfRangeException(
        "date",
        `Unsupported tax year; date must fall within range tax year ending 6 April ${TaxYearEnding.MinValue} to 6 April ${TaxYearEnding.MaxValue}`,
      );
    }

    return taxYear;
  }

  /**
   * Calculates the age of a person on a certain date based on the supplied date of birth. Takes account of leap years,
   * using the convention that someone born on 29th February in a leap year is not legally one year older until 1st March
   * of a non-leap year.
   * @param dateOfBirth Individual's date of birth.
   * @param date Date at which to evaluate age at.
   * @returns Age of the individual in years (as an integer).
   */
  static ageAt(dateOfBirth: CalendarDate, date: CalendarDate): number {
    let age = date.year - dateOfBirth.year;
    return dateOfBirth > date.addMonths(12 * -age) ? --age : age;
  }

  /**
   * Converts the supplied Date to a PayDate based on the specified PayFrequency.
   * @param date Date to obtain PayDate for.
   * @param payFrequency Applicable pay frequency for this pay date.
   * @returns PayDate for the supplied date and pay frequency.
   */
  static toPayDate(date: CalendarDate, payFrequency: PayFrequency): PayDate {
    return new PayDate(date, payFrequency);
  }

  /**
   * Returns the date as a string in UK format (dd/mm/yyyy).
   * @param date Date to get string representation for.
   * @returns UK format date string.
   */
  static toUk(date: CalendarDate): string {
    return date.toFormat("dd/MM/yyyy");
  }

  /**
   * Returns the earlier of two dates.
   * @param date First date to compare.
   * @param other Second date to compare.
   * @returns The earlier of the two dates.
   */
  static orIfEarlier(date: CalendarDate, other: CalendarDate): CalendarDate {
    return date > other ? other : date;
  }

  /**
   * Returns the later of two dates.
   * @param date First date to compare.
   * @param other Second date to compare.
   * @returns The later of the two dates.
   */
  static orIfLater(date: CalendarDate, other: CalendarDate): CalendarDate {
    return other > date ? other : date;
  }
}
