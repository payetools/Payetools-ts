// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Enumeration that is used to indicate a band of normal hours worked by an employee.
 */
export enum NormalHoursWorkedBand {
  /** Up to 15.99 hours */
  A = "A",

  /** 16 to 23.99 hours */
  B = "B",

  /** 24 to 29.99 hours */
  C = "C",

  /** 30 hours or more */
  D = "D",

  /** Other */
  E = "E",
}
