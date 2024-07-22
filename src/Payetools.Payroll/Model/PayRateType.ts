// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Enum representing different pay types, i.e., salaried, hourly paid, etc.
 */
export enum PayRateType {
  /**
   * Per annum pay type for salaried employees.
   */
  Salaried,

  /**
   * Hourly pay type for hourly-paid employees.
   */
  HourlyPaid,

  /**
   * All pay rate type other than salaried and hourly paid.
   */
  Other,
}
