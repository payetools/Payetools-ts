// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IApplicableFromTill } from "~/Payetools.Common/Model/IApplicableFromTill";
import { PensionsThresholdEntry } from "./PensionsThresholdEntry";
import { CalendarDate } from "calendar-date";
import { JsonObject, JsonProperty } from "json2typescript";
import { DateOnlyJsonConverter } from "~/Payetools.Common/Serialization/DateOnlyJsonConverter";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";

/**
 * Represents the reference data for pensions for a period; where there have been in-year changes,
 * then there may be several such entries for a given tax year, although this is very uncommon.
 */
@JsonObject("PensionsReferenceDataSet")
export class PensionsReferenceDataSet implements IApplicableFromTill {
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
   * Gets the basic rate of tax applicable across all tax regimes for relief at source pension contributions, for the specified
   * tax year.  (As at the time of writing, one basic rate of tax is used across all jurisdictions in spite of the fact that
   * some have a lower basic rate of tax.)
   */
  @JsonProperty("basicRateOfTaxForTaxRelief", BigJsonConverter)
  basicRateOfTaxForTaxRelief: Big;

  /**
   * Gets the lower set of earnings thresholds for Qualifying Earnings (i.e., per week, per 2-weeks, etc.).
   */
  @JsonProperty("qualifyingEarningsLowerLevel", PensionsThresholdEntry)
  qualifyingEarningsLowerLevel: PensionsThresholdEntry;

  /**
   * Gets the upper set of earnings thresholds for Qualifying Earnings (i.e., per week, per 2-weeks, etc.).
   */
  @JsonProperty("qualifyingEarningsUpperLevel", PensionsThresholdEntry)
  qualifyingEarningsUpperLevel: PensionsThresholdEntry;

  /**
   * Gets the set of earnings triggers for Automatic Enrolment (i.e., per week, per 2-weeks, etc.).
   */
  @JsonProperty("aeEarningsTrigger", PensionsThresholdEntry)
  aeEarningsTrigger: PensionsThresholdEntry;

  constructor(
    applicableFrom: CalendarDate,
    applicableTill: CalendarDate,
    basicRateOfTaxForTaxRelief: Big,
    qualifyingEarningsLowerLevel: PensionsThresholdEntry,
    qualifyingEarningsUpperLevel: PensionsThresholdEntry,
    aeEarningsTrigger: PensionsThresholdEntry,
  ) {
    this.applicableFrom = applicableFrom;
    this.applicableTill = applicableTill;
    this.basicRateOfTaxForTaxRelief = basicRateOfTaxForTaxRelief;
    this.qualifyingEarningsLowerLevel = qualifyingEarningsLowerLevel;
    this.qualifyingEarningsUpperLevel = qualifyingEarningsUpperLevel;
    this.aeEarningsTrigger = aeEarningsTrigger;
  }
}
