// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Represents the amounts that can be reclaimed from HMRC against eligible statutory payments.
 */
export interface IStatutoryPaymentReclaim {
  /**
   * Gets the total Statutory Maternity Pay amount for the tax month. May be zero.
   * @remarks This is the statutory amount repayable by HMRC, which is either the reduced amount using the current
   * HMRC published percentage (e.g., 92% in 2024/5) for larger employers, or the total amount claimed (i.e., 100%)
   * for employers that are entitled to Small Employers Relief. Any additional percentage-based reclaim amount
   * (e.g., 3% in 2024/5) is given via the `additionalNiCompensationOnSMP` property.
   */
  reclaimableStatutoryMaternityPay: number;

  /**
   * Gets the total Statutory Paternity Pay amount for the tax month. May be zero.
   * @remarks This is the statutory amount repayable by HMRC, which is either the reduced amount using the current
   * HMRC published percentage (e.g., 92% in 2024/5) for larger employers, or the total amount claimed (i.e., 100%)
   * for employers that are entitled to Small Employers Relief. Any additional percentage-based reclaim amount
   * (e.g., 3% in 2024/5) is given via the `additionalNiCompensationOnSPP` property.
   */
  reclaimableStatutoryPaternityPay: number;

  /**
   * Gets the total Statutory Adoption Pay amount for the tax month. May be zero.
   * @remarks This is the statutory amount repayable by HMRC, which is either the reduced amount using the current
   * HMRC published percentage (e.g., 92% in 2024/5) for larger employers, or the total amount claimed (i.e., 100%)
   * for employers that are entitled to Small Employers Relief. Any additional percentage-based reclaim amount
   * (e.g., 3% in 2024/5) is given via the `additionalNiCompensationOnSAP` property.
   */
  reclaimableStatutoryAdoptionPay: number;

  /**
   * Gets the total Statutory Shared Parental Pay amount for the tax month. May be zero.
   * @remarks This is the statutory amount repayable by HMRC, which is either the reduced amount using the current
   * HMRC published percentage (e.g., 92% in 2024/5) for larger employers, or the total amount claimed (i.e., 100%)
   * for employers that are entitled to Small Employers Relief. Any additional percentage-based reclaim amount
   * (e.g., 3% in 2024/5) is given via the `additionalNiCompensationOnSShPP` property.
   */
  reclaimableStatutorySharedParentalPay: number;

  /**
   * Gets the total Statutory Parental Bereavement Pay amount for the tax month. May be zero.
   * @remarks This is the statutory amount repayable by HMRC, which is either the amount reduced by the current
   * HMRC published percentage (e.g., 92% in 2024/5) for larger employers, or the total amount claimed (i.e., 100%)
   * for employers that are entitled to Small Employers Relief. Any additional percentage-based reclaim amount
   * (e.g., 3% in 2024/5) is given via the `additionalNiCompensationOnSPBP` property.
   */
  reclaimableStatutoryParentalBereavementPay: number;

  /**
   * Gets any additional National Insurance compensation available for Statutory Maternity Pay
   * in the case that the employer qualifies for Small Employers Relief. Note that the value
   * `reclaimableStatutoryMaternityPay` already includes this amount (if applicable).
   */
  additionalNiCompensationOnSMP: number;

  /**
   * Gets any additional National Insurance compensation available for Statutory Paternity Pay
   * in the case that the employer qualifies for Small Employers Relief. Note that the value
   * `reclaimableStatutoryPaternityPay` already includes this amount (if applicable).
   */
  additionalNiCompensationOnSPP: number;

  /**
   * Gets any additional National Insurance compensation available for Statutory Adoption Pay
   * in the case that the employer qualifies for Small Employers Relief. Note that the value
   * `reclaimableStatutoryAdoptionPay` already includes this amount (if applicable).
   */
  additionalNiCompensationOnSAP: number;

  /**
   * Gets any additional National Insurance compensation available for Statutory Shared Parental Pay
   * in the case that the employer qualifies for Small Employers Relief. Note that the value
   * `reclaimableStatutorySharedParentalPay` already includes this amount (if applicable).
   */
  additionalNiCompensationOnSShPP: number;

  /**
   * Gets any additional National Insurance compensation available for Statutory Parental Bereavement Pay
   * in the case that the employer qualifies for Small Employers Relief. Note that the value
   * `reclaimableStatutoryParentalBereavementPay` already includes this amount (if applicable).
   */
  additionalNiCompensationOnSPBP: number;

  /**
   * Gets any CIS deductions suffered.
   */
  cisDeductionsSuffered: number;
}

/**
 * Represents the amounts that can be reclaimed from HMRC against eligible statutory payments.
 */
export class StatutoryPaymentReclaim implements IStatutoryPaymentReclaim {
  reclaimableStatutoryMaternityPay: number;
  reclaimableStatutoryPaternityPay: number;
  reclaimableStatutoryAdoptionPay: number;
  reclaimableStatutorySharedParentalPay: number;
  reclaimableStatutoryParentalBereavementPay: number;
  additionalNiCompensationOnSMP: number;
  additionalNiCompensationOnSPP: number;
  additionalNiCompensationOnSAP: number;
  additionalNiCompensationOnSShPP: number;
  additionalNiCompensationOnSPBP: number;
  cisDeductionsSuffered: number;

  constructor(init: IStatutoryPaymentReclaim) {
    this.reclaimableStatutoryMaternityPay =
      init.reclaimableStatutoryMaternityPay;
    this.reclaimableStatutoryPaternityPay =
      init.reclaimableStatutoryPaternityPay;
    this.reclaimableStatutoryAdoptionPay = init.reclaimableStatutoryAdoptionPay;
    this.reclaimableStatutorySharedParentalPay =
      init.reclaimableStatutorySharedParentalPay;
    this.reclaimableStatutoryParentalBereavementPay =
      init.reclaimableStatutoryParentalBereavementPay;
    this.additionalNiCompensationOnSMP = init.additionalNiCompensationOnSMP;
    this.additionalNiCompensationOnSPP = init.additionalNiCompensationOnSPP;
    this.additionalNiCompensationOnSAP = init.additionalNiCompensationOnSAP;
    this.additionalNiCompensationOnSShPP = init.additionalNiCompensationOnSShPP;
    this.additionalNiCompensationOnSPBP = init.additionalNiCompensationOnSPBP;
    this.cisDeductionsSuffered = init.cisDeductionsSuffered;
  }
}
