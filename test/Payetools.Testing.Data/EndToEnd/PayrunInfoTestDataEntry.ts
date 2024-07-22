// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { JsonObject, JsonProperty } from "json2typescript";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IPayRunInfoTestDataEntry } from "./IPayrunInfoTestDataEntry";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";
import { DateOnlyJsonConverter } from "~/Payetools.Common/Serialization/DateOnlyJsonConverter";

@JsonObject("PayRunInfoTestDataEntry")
export class PayRunInfoTestDataEntry implements IPayRunInfoTestDataEntry {
  @JsonProperty("DefinitionVersion", String)
  definitionVersion: string = "";

  @JsonProperty("TestIdentifier", String)
  testIdentifier: string = "";

  @JsonProperty("TaxYearEnding", TaxYearEndingJsonConverter)
  taxYearEnding: TaxYearEnding = TaxYearEnding.Unspecified;

  @JsonProperty("TestReference", String)
  testReference: string = "";

  @JsonProperty("PayDay", DateOnlyJsonConverter)
  payDay: CalendarDate = CalendarDate.nowUTC();

  @JsonProperty("PayPeriodStart", DateOnlyJsonConverter)
  payPeriodStart: CalendarDate = CalendarDate.nowUTC();

  @JsonProperty("PayPeriodEnd", DateOnlyJsonConverter)
  payPeriodEnd: CalendarDate = CalendarDate.nowUTC();

  @JsonProperty("PayFrequency", String)
  payFrequency: PayFrequency = PayFrequency.Weekly;
}
