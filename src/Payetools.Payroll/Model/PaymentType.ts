// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Enumeration that represents the different types of payments that an employee can receive.
 */
export enum PaymentType {
  /** Not specified. */
  Unspecified,

  /** General earnings (wages/salary, bonus, commission, etc.). */
  GeneralEarnings,

  /** Expenses claim. Not usually subject to tax or NI. */
  Expenses,

  /** Statutory Sick Pay. */
  StatutorySickPay,

  /** Statutory Maternity Pay. */
  StatutoryMaternityPay,

  /** Statutory Paternity Pay. */
  StatutoryPaternityPay,

  /** Statutory Shared Parental Pay. */
  StatutorySharedParentalPay,

  /** Statutory Adoption Pay. */
  StatutoryAdoptionPay,

  /** Statutory Parental Bereavement Pay. */
  StatutoryParentalBereavementPay,

  /**
   * Occupational (i.e., employer voluntary) sick pay; allows single-line reporting of SSP and occupational
   * sick pay.
   */
  OccupationalSickPay,

  /**
   * Occupational (i.e., employer voluntary) maternity pay; allows single-line reporting of SMP and
   * occupational maternity pay.
   */
  OccupationalMaternityPay,

  /**
   * Occupational (i.e., employer voluntary) paternity pay; allows single-line reporting of SPP and
   * occupational paternity pay.
   */
  OccupationalPaternityPay,

  /**
   * Occupational (i.e., employer voluntary) shared parental pay; allows single-line reporting of ShPP and
   * occupational shared parental pay.
   */
  OccupationalSharedParentalPay,

  /**
   * Occupational (i.e., employer voluntary) adoption pay; allows single-line reporting of SAP and occupational
   * adoption pay.
   */
  OccupationalAdoptionPay,

  /**
   * Occupational (i.e., employer voluntary) parental bereavement pay; allows single-line reporting of SPBP and
   * occupational shared parental bereavement pay.
   */
  OccupationalParentalBereavementPay,

  /** Adjustment to pay, for example, refund of previous deduction. */
  Adjustment,
}
