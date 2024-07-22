// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

// Enum representing different pay units, i.e., per annum, per hour, etc.
export enum PayRateUnits {
  // Per annum pay type for salaried employees.
  PerAnnum,

  // Hourly pay type for hourly-paid employees.
  PerHour,

  // Daily rate, typically for salaried employees with regular working patterns.
  PerDay,

  // Weekly rate, commonly used for some statutory payments.
  PerWeek,

  // Per pay period, useful for fixed amounts each pay period.
  PerPayPeriod,
}
