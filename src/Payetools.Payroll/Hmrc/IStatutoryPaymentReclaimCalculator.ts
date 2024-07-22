// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IEmployer } from "../Model/IEmployer";
import { IEmployerHistoryEntry } from "../Model/IEmployerHistoryEntry";
import { IStatutoryPaymentReclaim } from "../Model/IStatutoryPaymentReclaim";

/**
 * Interface for types that provide statutory payment reclaim calculations.
 */
export interface IStatutoryPaymentReclaimCalculator {
  /**
   * Calculates the allowable reclaim amounts for all reclaimable statutory payments.
   *
   * @param employer - Employer that this calculation pertains to.
   * @param employerMonthEntry - Aggregated month's figures for a given employer.
   * @param reclaim - New instance of object that implements {@link IEmployerHistoryEntry} containing
   * the reclaimable amounts for each statutory payment.
   */
  calculate(
    employer: IEmployer,
    employerMonthEntry: IEmployerHistoryEntry,
    reclaim: IStatutoryPaymentReclaim,
  ): void;
}
