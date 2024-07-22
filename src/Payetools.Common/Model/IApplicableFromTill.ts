// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";

/**
 * Interface for reference data that indicates the period that a reference data applies for.
 */
export interface IApplicableFromTill {
  /**
   * Gets the start date (i.e., the first full day) for applicability. Use DateOnly.MinValue to
   * indicate there is no effective start date.
   */
  applicableFrom: CalendarDate;

  /**
   * Gets the end date (i.e., the last full day) for applicability. Use DateOnly.MaxValue to
   * indicate there is no effective end date.
   */
  applicableTill: CalendarDate;
}
