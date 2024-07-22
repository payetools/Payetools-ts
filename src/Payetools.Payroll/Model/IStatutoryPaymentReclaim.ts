// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";

/**
 * Interface that represents the amounts that can be reclaimed from HMRC against eligible statutory payments.
 */
export interface IStatutoryPaymentReclaim {
  /**
   * Gets the total Statutory Maternity Pay amount for the tax month. May be zero.
   *
   * This is the statutory amount repayable by HMRC, which is either the reduced amount using the current
   * HMRC published percentage (e.g., 92% in 2024/5) for larger employers, or the total amount claimed (i.e., 100%)
   * for employers that are entitled to Small Employers Relief. Any additional percentage-based reclaim amount
   * (e.g., 3% in 2024/5) is given via the `additionalNiCompensationOnSMP` property.
   */
  reclaimableStatutoryMaternityPay: Money;

  /**
   * Gets the total Statutory Paternity Pay amount for the tax month. May be zero.
   *
   * This is the statutory amount repayable by HMRC, which is either the reduced amount using the current
   * HMRC published percentage (e.g., 92% in 2024/5) for larger employers, or the total amount claimed (i.e., 100%)
   * for employers that are entitled to Small Employers Relief. Any additional percentage-based reclaim amount
   * (e.g., 3% in 2024/5) is given via the `additionalNiCompensationOnSPP` property.
   */
  reclaimableStatutoryPaternityPay: Money;

  /**
   * Gets the total Statutory Adoption Pay amount for the tax month. May be zero.
   *
   * This is the statutory amount repayable by HMRC, which is either the reduced amount using the current
   * HMRC published percentage (e.g., 92% in 2024/5) for larger employers, or the total amount claimed (i.e., 100%)
   * for employers that are entitled to Small Employers Relief. Any additional percentage-based reclaim amount
   * (e.g., 3% in 2024/5) is given via the `additionalNiCompensationOnSAP` property.
   */
  reclaimableStatutoryAdoptionPay: Money;

  /**
   * Gets the total Statutory Shared Parental Pay amount for the tax month. May be zero.
   *
   * This is the statutory amount repayable by HMRC, which is either the reduced amount using the current
   * HMRC published percentage (e.g., 92% in 2024/5) for larger employers, or the total amount claimed (i.e., 100%)
   * for employers that are entitled to Small Employers Relief. Any additional percentage-based reclaim amount
   * (e.g., 3% in 2024/5) is given via the `additionalNiCompensationOnSShPP` property.
   */
  reclaimableStatutorySharedParentalPay: Money;

  /**
   * Gets the total Statutory Parental Bereavement Pay amount for the tax month. May be zero.
   *
   * This is the statutory amount repayable by HMRC, which is either the amount reduced by the current
   * HMRC published percentage (e.g., 92% in 2024/5) for larger employers, or the total amount claimed (i.e., 100%)
   * for employers that are entitled to Small Employers Relief. Any additional percentage-based reclaim amount
   * (e.g., 3% in 2024/5) is given via the `additionalNiCompensationOnSPBP` property.
   */
  reclaimableStatutoryParentalBereavementPay: Money;

  /**
   * Gets any additional National Insurance compensation available for Statutory Maternity Pay
   * in the case that the employer qualifies for Small Employers Relief. Note that the value
   * `reclaimableStatutoryMaternityPay` already includes this amount (if applicable).
   */
  additionalNiCompensationOnSMP: Money;

  /**
   * Gets any additional National Insurance compensation available for Statutory Paternity Pay
   * in the case that the employer qualifies for Small Employers Relief. Note that the value
   * `reclaimableStatutoryPaternityPay` already includes this amount (if applicable).
   */
  additionalNiCompensationOnSPP: Money;

  /**
   * Gets any additional National Insurance compensation available for Statutory Adoption Pay
   * in the case that the employer qualifies for Small Employers Relief. Note that the value
   * `reclaimableStatutoryAdoptionPay` already includes this amount (if applicable).
   */
  additionalNiCompensationOnSAP: Money;

  /**
   * Gets any additional National Insurance compensation available for Statutory Shared Parental Pay
   * in the case that the employer qualifies for Small Employers Relief. Note that the value
   * `reclaimableStatutorySharedParentalPay` already includes this amount (if applicable).
   */
  additionalNiCompensationOnSShPP: Money;

  /**
   * Gets any additional National Insurance compensation available for Statutory Parental Bereavement Pay
   * in the case that the employer qualifies for Small Employers Relief. Note that the value
   * `reclaimableStatutoryParentalBereavementPay` already includes this amount (if applicable).
   */
  additionalNiCompensationOnSPBP: Money;

  /**
   * Gets any CIS deductions suffered.
   */
  cisDeductionsSuffered: Money;
}
