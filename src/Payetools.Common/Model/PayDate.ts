// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { TaxYear } from "./TaxYear";
import { PayFrequency } from "./PayFrequency";

/**
 * Represents a specific pay date for a specific pay frequency.
 */
export class PayDate {
  /**
   * Gets the date of this PayDate.
   */
  public readonly date: CalendarDate;

  /**
   * Gets the TaxYear for this PayDate.
   */
  public readonly taxYear: TaxYear;

  /**
   * Gets the tax period for this PayDate, for example, a pay date of 20th May for a monthly
   * payroll would be tax period 2.
   */
  public readonly taxPeriod: number;

  /**
   * Gets the pay frequency for this PayDate.
   */
  public readonly payFrequency: PayFrequency;

  /**
   * Initialises a new PayDate based on the supplied date and pay frequency.
   * @param date Pay date.
   * @param payFrequency Pay frequency.
   */
  constructor(date: CalendarDate, payFrequency: PayFrequency);
  /**
   * Initialises a new PayDate based on the supplied date and pay frequency.
   * @param year Year.
   * @param month Month (1-12).
   * @param day Day.
   * @param payFrequency Pay frequency.
   */
  constructor(
    year: number,
    month: number,
    day: number,
    payFrequency: PayFrequency,
  );
  constructor(
    dateOrYear: CalendarDate | number,
    monthOrPayFrequency: number | PayFrequency,
    day?: number,
    payFrequency?: PayFrequency,
  ) {
    if (dateOrYear instanceof CalendarDate) {
      this.date = dateOrYear;
      this.payFrequency = monthOrPayFrequency as PayFrequency;
    } else {
      this.date = new CalendarDate(
        dateOrYear,
        monthOrPayFrequency as number,
        day!,
      );
      this.payFrequency = payFrequency!;
    }
    this.taxYear = TaxYear.fromTaxYearEnding(this.date);
    this.taxPeriod = this.taxYear.getTaxPeriod(this.date, this.payFrequency);
  }

  /**
   * Gets the equivalent Date for this paydate, with the time portion set
   * to midnight (00:00:00) and the DateTimeKind set to Unspecified.
   * @param payDate PayDate to get the DateTime for.
   */
  public static toDateTime(payDate: PayDate): Date {
    return payDate.date.toDateUTC();
  }

  /**
   * Provides a string representation of this pay date in the form 'dd/mm/yyyy (frequency, period)'.
   * @returns String representation of this PayDate.
   */
  public toString(): string {
    return `${this.date.toFormat("dd/MM/yyyy")} (${this.payFrequency}, period ${this.taxPeriod})`;
  }

  /**
   * Gets either the week number or the month number for this pay date, with
   * the second out parameter indicating which.
   * @param periodNumber Week number or month number for this pay date.
   * @param isWeekly True if the first out parameter is a week number,
   * false indicates it is a month number.
   */
  public getWeekOrMonthNumber(): { periodNumber: number; isWeekly: boolean } {
    const isWeekly =
      this.payFrequency === PayFrequency.Weekly ||
      this.payFrequency === PayFrequency.Fortnightly ||
      this.payFrequency === PayFrequency.FourWeekly;

    const periodNumber = isWeekly
      ? this.taxYear.getWeekNumber(this.date, this.payFrequency)
      : this.taxYear.getMonthNumber(this.date, this.payFrequency);

    return { periodNumber, isWeekly };
  }
}
