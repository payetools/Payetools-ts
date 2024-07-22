// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IApplicableFromTill } from "~/Payetools.Common/Model/IApplicableFromTill";
import { StudentLoanThresholdsEntry } from "./StudentLoanThresholdsEntry";
import { CalendarDate } from "calendar-date";
import { StudentLoanRatesSet } from "./StudentLoanRatesSet";
import { JsonObject, JsonProperty } from "json2typescript";
import { DateOnlyJsonConverter } from "~/Payetools.Common/Serialization/DateOnlyJsonConverter";

/**
 * Represents the reference data for student loans for a period; where there have been in-year changes,
 * then there may be several such entries for a given tax year, although this is very uncommon.
 */
@JsonObject("StudentLoanReferenceDataEntry")
export class StudentLoanReferenceDataEntry implements IApplicableFromTill {
  /**
   * Gets the start date (i.e., the first full day) for applicability.
   */
  @JsonProperty("applicableFrom", DateOnlyJsonConverter)
  applicableFrom: CalendarDate;

  /**
   * Gets the end date (i.e., the last full day) for applicability.
   */
  @JsonProperty("applicableTill", DateOnlyJsonConverter)
  applicableTill: CalendarDate;

  /**
   * Gets the weekly, monthly and annual threshold for Plan 1 student loan deductions.
   */
  @JsonProperty("plan1Thresholds", StudentLoanThresholdsEntry)
  plan1Thresholds: StudentLoanThresholdsEntry;

  /**
   * Gets the weekly, monthly and annual threshold for Plan 2 student loan deductions.
   */
  @JsonProperty("plan2Thresholds", StudentLoanThresholdsEntry)
  plan2Thresholds: StudentLoanThresholdsEntry;

  /**
   * Gets the weekly, monthly and annual threshold for Plan 4 student loan deductions.
   */
  @JsonProperty("plan4Thresholds", StudentLoanThresholdsEntry)
  plan4Thresholds: StudentLoanThresholdsEntry;

  /**
   * Gets the weekly, monthly and annual threshold for post-graduate student loan deductions.
   */
  @JsonProperty("postGradThresholds", StudentLoanThresholdsEntry)
  postGradThresholds: StudentLoanThresholdsEntry;

  /**
   * Gets the set of rates to be used for student and post-graduate loan deductions.
   */
  @JsonProperty("deductionRates")
  deductionRates: StudentLoanRatesSet;

  constructor(
    applicableFrom: CalendarDate,
    applicableTill: CalendarDate,
    plan1Thresholds: StudentLoanThresholdsEntry,
    plan2Thresholds: StudentLoanThresholdsEntry,
    plan4Thresholds: StudentLoanThresholdsEntry,
    postGradThresholds: StudentLoanThresholdsEntry,
    deductionRates: StudentLoanRatesSet,
  ) {
    this.applicableFrom = applicableFrom;
    this.applicableTill = applicableTill;
    this.plan1Thresholds = plan1Thresholds;
    this.plan2Thresholds = plan2Thresholds;
    this.plan4Thresholds = plan4Thresholds;
    this.postGradThresholds = postGradThresholds;
    this.deductionRates = deductionRates;
  }
}
