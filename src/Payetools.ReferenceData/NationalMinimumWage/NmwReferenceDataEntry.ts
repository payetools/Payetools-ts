// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { IApplicableFromTill } from "~/Payetools.Common/Model/IApplicableFromTill";
import { INmwLevelSet } from "~/Payetools.NationalMinimumWage/ReferenceData/INmwLevelSet";
import { JsonObject, JsonProperty } from "json2typescript";
import { DateOnlyJsonConverter } from "~/Payetools.Common/Serialization/DateOnlyJsonConverter";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";
import { Money } from "@dintero/money";

/**
 * Represents the set of NMW/NLW levels for a given tax year (and potentially pay frequency/pay period combination).
 */
@JsonObject("NmwReferenceDataEntry")
export class NmwReferenceDataEntry
  implements INmwLevelSet, IApplicableFromTill
{
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
   * Gets the NMW level for apprentices under 19 or apprentices aged 19 and over in the first year of their apprenticeship.
   */
  @JsonProperty("apprenticeLevel", MoneyJsonConverter)
  apprenticeLevel: Money;

  /**
   * Gets the NMW level for employees under the age of 18 (but over the school leaving age).
   */
  @JsonProperty("under18Level", MoneyJsonConverter)
  under18Level: Money;

  /**
   * Gets the NMW level for employees aged between 18 and 20.
   */
  @JsonProperty("age18To20Level", MoneyJsonConverter)
  age18To20Level: Money;

  /**
   * Gets the NMW level for employees aged between 21 and 22.
   */
  @JsonProperty("age21To22Level", MoneyJsonConverter)
  age21To22Level: Money;

  /**
   * Gets the NLW (rather than NMW) level for employees aged 23 and over.
   */
  @JsonProperty("age23AndAboveLevel", MoneyJsonConverter)
  age23AndAboveLevel: Money;

  constructor(
    applicableFrom: CalendarDate,
    applicableTill: CalendarDate,
    apprenticeLevel: Money,
    under18Level: Money,
    age18To20Level: Money,
    age21To22Level: Money,
    age23AndAboveLevel: Money,
  ) {
    this.applicableFrom = applicableFrom;
    this.applicableTill = applicableTill;
    this.apprenticeLevel = apprenticeLevel;
    this.under18Level = under18Level;
    this.age18To20Level = age18To20Level;
    this.age21To22Level = age21To22Level;
    this.age23AndAboveLevel = age23AndAboveLevel;
  }
}
