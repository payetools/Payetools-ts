// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IApplicableFromTill } from "~/Payetools.Common/Model/IApplicableFromTill";
import { NiEmployeeRatesEntry } from "./NiEmployeeRatesEntry";
import { NiEmployerRatesEntry } from "./NiEmployerRatesEntry";
import { NiReferenceDataThresholdEntry } from "./NiReferenceDataThresholdEntry";
import { CalendarDate } from "calendar-date";
import { JsonObject, JsonProperty } from "json2typescript";
import { DateOnlyJsonConverter } from "~/Payetools.Common/Serialization/DateOnlyJsonConverter";
import Big from "big.js";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";

/**
 * Represents a set of Ni thresholds and rates for a period; where there have been in-year changes,
 * then there may be several such entries for a given tax year.
 */
@JsonObject("NiReferenceDataEntry")
export class NiReferenceDataEntry implements IApplicableFromTill {
  /**
   * Gets the start date (i.e., the first full day) for applicability.
   */
  @JsonProperty("applicableFrom", DateOnlyJsonConverter)
  applicableFrom: CalendarDate = CalendarDate.nowUTC();

  /**
   * Gets the end date (i.e., the last full day) for applicability.
   */
  @JsonProperty("applicableTill", DateOnlyJsonConverter)
  applicableTill: CalendarDate = CalendarDate.nowUTC();

  /**
   * Gets the basic rate of tax to be applied for tax relief on employee pension contributions
   * for relief at source pensions.
   */
  @JsonProperty("basicRateOfTaxForTaxRelief", BigJsonConverter)
  basicRateOfTaxForTaxRelief: Big = Big(0);

  /**
   * Gets a read-only list of applicable NI thresholds.
   */
  @JsonProperty("niThresholds", [NiReferenceDataThresholdEntry])
  niThresholds: NiReferenceDataThresholdEntry[] = [];

  /**
   * Gets applicable NI rates for employers.
   */
  @JsonProperty("employerRates", [NiEmployerRatesEntry])
  employerRates: NiEmployerRatesEntry[] = [];

  /**
   * Gets applicable NI rates for employees.
   */
  @JsonProperty("employeeRates", [NiEmployeeRatesEntry])
  employeeRates: NiEmployeeRatesEntry[] = [];

  /**
   * Gets applicable employer NI rates for directors. Only applicable when there has been an in-year
   * change to National Insurance rates.
   */
  @JsonProperty("directorEmployerRates", [NiEmployerRatesEntry], true)
  directorEmployerRates?: NiEmployerRatesEntry[];

  /**
   * Gets applicable employee NI rates for directors. Only applicable when there has been an in-year
   * change to National Insurance rates.
   */
  @JsonProperty("directorEmployeeRates", [NiEmployeeRatesEntry], true)
  directorEmployeeRates?: NiEmployeeRatesEntry[];
}
