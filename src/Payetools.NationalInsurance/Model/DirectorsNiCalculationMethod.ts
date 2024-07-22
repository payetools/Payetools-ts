// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Enum representing the method of director's NI calculation to be applied when calculating
 * National Insurance contributions for a director.
 */
export enum DirectorsNiCalculationMethod {
  /**
   * Standard annualised earnings method; common for directors who are paid irregularly.
   */
  StandardAnnualisedEarningsMethod,

  /**
   * Alternative method; common for directors who are paid regularly.
   */
  AlternativeMethod,
}
