// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { ApprenticeLevyInfo } from "./ApprenticeLevyInfo";
import { EmploymentAllowanceInfo } from "./EmploymentAllowanceInfo";
import { StatutoryPaymentReclaimInfo } from "./StatutoryPaymentReclaimInfo";

/**
 * Interface that classes implement in order to provide access to employer-level reference data, i.e.,
 * Employment Allowance, Small Employers Relief and Apprentice Levy.
 *
 * Note that all other reference data provider interfaces are hosted within the relevant business area
 * assembly, e.g., Payetools.IncomeTax. This interface is hosted within Payetools.ReferenceData because
 * it is used by Payetools.Payroll, and that assembly has a dependency on the reference data assembly.
 */
export interface IEmployerReferenceDataProvider {
  /**
   * Gets reference information about Employment Allowance.
   *
   * @param date - Applicable date for this reference information request.
   * @returns Reference data information on Employment Allowance for the specified date.
   */
  getEmploymentAllowanceInfoForDate(
    date: CalendarDate,
  ): EmploymentAllowanceInfo;

  /**
   * Gets reference information about reclaiming some or all of statutory payments (e.g., SMP, SPP).
   *
   * @param date - Applicable date for this reference information request.
   * @returns Reference data information on reclaiming statutory payments for the specified date.
   */
  getStatutoryPaymentReclaimInfoForDate(
    date: CalendarDate,
  ): StatutoryPaymentReclaimInfo;

  /**
   * Gets reference information about the Apprentice Levy.
   *
   * @param date - Applicable date for this reference information request.
   * @returns Reference data information on the Apprentice Levy for the specified date.
   */
  getApprenticeLevyInfoForDate(date: CalendarDate): ApprenticeLevyInfo;
}
