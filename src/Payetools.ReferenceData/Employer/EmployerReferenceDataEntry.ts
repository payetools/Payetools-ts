// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { JsonObject, JsonProperty } from "json2typescript";
import { IApplicableFromTill } from "~/Payetools.Common/Model/IApplicableFromTill";
import { DateOnlyJsonConverter } from "~/Payetools.Common/Serialization/DateOnlyJsonConverter";
import { ApprenticeLevyInfo } from "./ApprenticeLevyInfo";
import { EmploymentAllowanceInfo } from "./EmploymentAllowanceInfo";
import { StatutoryPaymentReclaimInfo } from "./StatutoryPaymentReclaimInfo";

/**
 * Represents the set of rates and thresholds for employers for a given period within a tax year.
 */
@JsonObject("EmployerReferenceDataEntry")
export class EmployerReferenceDataEntry implements IApplicableFromTill {
  /**
   * Gets the start date (i.e., the first full day) for applicability.
   */
  @JsonProperty("applicableFrom", DateOnlyJsonConverter)
  public applicableFrom: CalendarDate;

  /**
   * Gets the end date (i.e., the last full day) for applicability.
   */
  @JsonProperty("applicableTill", DateOnlyJsonConverter)
  public applicableTill: CalendarDate;

  /**
   * Gets reference information about Employment Allowance for the specified period.
   */
  public employmentAllowance: EmploymentAllowanceInfo;

  /**
   * Gets reference information about reclaiming some or all of statutory payments (e.g., SMP, SPP) for
   * the specified period.
   */
  public statutoryPaymentReclaim: StatutoryPaymentReclaimInfo =
    {} as StatutoryPaymentReclaimInfo;

  /**
   * Gets reference information about the Apprentice Levy as applicable for the specified period.
   */
  public apprenticeLevy: ApprenticeLevyInfo = {} as ApprenticeLevyInfo;

  constructor(
    applicableFrom: CalendarDate,
    applicableTill: CalendarDate,
    employmentAllowance: EmploymentAllowanceInfo,
    statutoryPaymentReclaim: StatutoryPaymentReclaimInfo,
    apprenticeLevy: ApprenticeLevyInfo,
  ) {
    this.applicableFrom = applicableFrom;
    this.applicableTill = applicableTill;
    this.employmentAllowance = employmentAllowance;
    this.statutoryPaymentReclaim = statutoryPaymentReclaim;
    this.apprenticeLevy = apprenticeLevy;
  }
}
