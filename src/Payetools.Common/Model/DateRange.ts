// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";

/**
 * Represents a date range.
 */
export class DateRange implements Iterable<CalendarDate> {
  /**
   * Gets the start of this date range.
   */
  public readonly start: CalendarDate;

  /**
   * Gets the end of this date range.
   */
  public readonly end: CalendarDate;

  /**
   * Initialises a new DateRange from the supplied start and end dates.
   * @param startDate Start of date range.
   * @param endDate End of date range.
   * @throws {Error} Thrown if endDate is before startDate.
   */
  constructor(startDate: CalendarDate, endDate: CalendarDate);
  /**
   * Initialises a new DateRange from the supplied start date and duration,
   * ensuring that the end date is never later than the supplied latestAllowableDate.
   * @param startDate Start of date range.
   * @param duration Duration of the DateRange, in days.
   * @param latestAllowableDate Latest allowable end date for the DateRange.
   * @throws {Error} Thrown if duration is less than a day.
   */
  constructor(
    startDate: CalendarDate,
    duration: number,
    latestAllowableDate?: CalendarDate,
  );
  constructor(
    startDate: CalendarDate,
    endDateOrDuration: CalendarDate | number,
    latestAllowableDate?: CalendarDate,
  ) {
    if (typeof endDateOrDuration === "number") {
      if (endDateOrDuration < 1) {
        throw new Error("Duration must be at least one day");
      }
      this.start = startDate;
      this.end = latestAllowableDate
        ? CalendarDate.min(
            startDate.addDays(endDateOrDuration - 1),
            latestAllowableDate,
          )
        : startDate.addDays(endDateOrDuration - 1);
    } else {
      if (endDateOrDuration < startDate) {
        throw new Error("End date must be on or after start date");
      }
      this.start = startDate;
      this.end = endDateOrDuration;
    }
  }

  /**
   * Determines whether two DateRange instances are equal.
   * @param other DateRange to compare for equality.
   * @returns True if the two DateRanges are equivalent; false otherwise.
   */
  public equalsExact(other: DateRange): boolean {
    return this.start.equals(other.start) && this.end.equals(other.end);
  }

  /**
   * Gets an enumerator across this DateRange. Enables use of for...of.
   * @returns Enumerator for enumerating across all the dates in between the Start and End dates.
   */
  public *[Symbol.iterator](): Iterator<CalendarDate> {
    let date = this.start;
    while (date <= this.end) {
      yield date;
      date = date.addDays(1);
    }
  }

  /**
   * Determines whether two DateRange instances are equal.
   * @param obj Object to compare for equality.
   * @returns True if the two DateRanges are equivalent; false otherwise.
   */
  public equals(obj: any): boolean {
    if (obj instanceof DateRange) {
      return this.equalsExact(obj);
    }
    return false;
  }

  // /**
  //  * Returns the hash code for this object.
  //  * @returns A hash code for the current object.
  //  */
  // public getHashCode(): number {
  //     return this.start.getHashCode() ^ this.end.getHashCode();
  // }

  /**
   * Evaluates whether two range ranges are equivalent.
   * @param left First DateRange to compare.
   * @param right Second DateRange to compare.
   * @returns True if the two DateRanges are equivalent; false otherwise.
   */
  public static equals(left: DateRange, right: DateRange): boolean {
    return left.equals(right);
  }

  /**
   * Evaluates whether two range ranges are not equivalent.
   * @param left First DateRange to compare.
   * @param right Second DateRange to compare.
   * @returns True if the two DateRanges are not equivalent; false otherwise.
   */
  public static notEquals(left: DateRange, right: DateRange): boolean {
    return !DateRange.equals(left, right);
  }

  /**
   * Returns a string that represents the current object. Intended mainly for debug purposes.
   * @returns String representation of the DateRange in the format: start - end.
   */
  public toString(): string {
    return `${this.start} - ${this.end}`;
  }
}
