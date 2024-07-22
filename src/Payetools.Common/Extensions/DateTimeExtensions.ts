// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

// Extension methods for instances of Date

/**
 * Gets an instance of Date from the supplied Date but with the time portion set to midday (12:00:00) UTC.
 * @param date Source Date instance.
 * @returns Date with the same date but time portion set to 12:00:00 UTC.
 */
function middayUtc(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      12,
      0,
      0,
    ),
  );
}
