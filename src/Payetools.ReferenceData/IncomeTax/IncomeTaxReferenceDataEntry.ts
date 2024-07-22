// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IApplicableFromTill } from "~/Payetools.Common/Model/IApplicableFromTill";
import { IncomeTaxBandEntry } from "./IncomeTaxBandEntry";
import { CalendarDate } from "calendar-date";
import { JsonObject, JsonProperty } from "json2typescript";
import { DateOnlyJsonConverter } from "~/Payetools.Common/Serialization/DateOnlyJsonConverter";

/**
 * Represents a set of tax bands for a given tax regime for a period, typically a full tax year.
 */
@JsonObject("IncomeTaxReferenceDataEntry")
export class IncomeTaxReferenceDataEntry implements IApplicableFromTill {
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
   * Gets a read-only list of applicable tax bands.
   */
  @JsonProperty("taxEntries", [IncomeTaxBandEntry])
  taxEntries: IncomeTaxBandEntry[];

  constructor(
    applicableFrom: CalendarDate,
    applicableTill: CalendarDate,
    taxEntries: IncomeTaxBandEntry[],
  ) {
    this.applicableFrom = applicableFrom;
    this.applicableTill = applicableTill;
    this.taxEntries = taxEntries;
  }
}
