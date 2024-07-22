// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { StatutoryPaymentReclaimInfo } from "~/Payetools.ReferenceData/Employer/StatutoryPaymentReclaimInfo";
import { IEmployer } from "../Model/IEmployer";
import { IEmployerHistoryEntry } from "../Model/IEmployerHistoryEntry";
import { IStatutoryPaymentReclaim } from "../Model/IStatutoryPaymentReclaim";
import { IStatutoryPaymentReclaimCalculator } from "./IStatutoryPaymentReclaimCalculator";
import { RoundUp, gbp, zeroGbp } from "~/CurrencyHelpers";
import Big from "big.js";

/**
 * Aggregator that provides summarisation across multiple pay runs.
 */
export class StatutoryPaymentReclaimCalculator
  implements IStatutoryPaymentReclaimCalculator
{
  private readonly statutoryPaymentReclaimInfo: StatutoryPaymentReclaimInfo;

  /**
   * Initializes a new instance of the StatutoryPaymentReclaimCalculator class.
   * @param statutoryPaymentReclaimInfo - Statutory payment reclaim reference data.
   */
  constructor(statutoryPaymentReclaimInfo: StatutoryPaymentReclaimInfo) {
    this.statutoryPaymentReclaimInfo = statutoryPaymentReclaimInfo;
  }

  /**
   * Calculates the allowable reclaim amounts for all reclaimable statutory payments.
   * @param employer - Employer that this calculation pertains to.
   * @param employerMonthEntry - Aggregated month's figures for a given employer.
   * @param reclaim - New instance of object that implements IEmployerHistoryEntry containing
   * the reclaimable amounts for each statutory payment.
   * @remarks Fractions of a penny are rounded up, as per
   * https://www.gov.uk/hmrc-internal-manuals/statutory-payments-manual/spm180500.
   */
  calculate(
    employer: IEmployer,
    employerMonthEntry: IEmployerHistoryEntry,
  ): IStatutoryPaymentReclaim {
    const reclaimRate = employer.isEligibleForSmallEmployersRelief
      ? Big(1.0)
      : this.statutoryPaymentReclaimInfo.defaultReclaimRate;

    const additionalRate = employer.isEligibleForSmallEmployersRelief
      ? this.statutoryPaymentReclaimInfo.smallEmployersReclaimRate.sub(1.0)
      : Big(0.0);

    return {
      reclaimableStatutoryMaternityPay: gbp(
        employerMonthEntry.totalStatutoryMaternityPay
          .amount()
          .mul(reclaimRate)
          .round(2, RoundUp),
      ),
      reclaimableStatutoryAdoptionPay: gbp(
        employerMonthEntry.totalStatutoryAdoptionPay
          .amount()
          .mul(reclaimRate)
          .round(2, RoundUp),
      ),
      reclaimableStatutoryPaternityPay: gbp(
        employerMonthEntry.totalStatutoryPaternityPay
          .amount()
          .mul(reclaimRate)
          .round(2, RoundUp),
      ),
      reclaimableStatutorySharedParentalPay: gbp(
        employerMonthEntry.totalStatutorySharedParentalPay
          .amount()
          .mul(reclaimRate)
          .round(2, RoundUp),
      ),
      reclaimableStatutoryParentalBereavementPay: gbp(
        employerMonthEntry.totalStatutoryParentalBereavementPay
          .amount()
          .mul(reclaimRate)
          .round(2, RoundUp),
      ),
      additionalNiCompensationOnSMP: gbp(
        employerMonthEntry.totalStatutoryMaternityPay
          .amount()
          .mul(additionalRate)
          .round(2, RoundUp),
      ),
      additionalNiCompensationOnSAP: gbp(
        employerMonthEntry.totalStatutoryAdoptionPay
          .amount()
          .mul(additionalRate)
          .round(2, RoundUp),
      ),
      additionalNiCompensationOnSPP: gbp(
        employerMonthEntry.totalStatutoryPaternityPay
          .amount()
          .mul(additionalRate)
          .round(2, RoundUp),
      ),
      additionalNiCompensationOnSShPP: gbp(
        employerMonthEntry.totalStatutorySharedParentalPay
          .amount()
          .mul(additionalRate)
          .round(2, RoundUp),
      ),
      additionalNiCompensationOnSPBP: gbp(
        employerMonthEntry.totalStatutoryParentalBereavementPay
          .amount()
          .mul(additionalRate)
          .round(2, RoundUp),
      ),
      cisDeductionsSuffered: zeroGbp,
    };
  }
}
