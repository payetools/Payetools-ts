// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IHmrcIncomeTaxTestDataEntry } from "./IHmrcIncomeTaxTestDataEntry";
import { JsonObject, JsonProperty } from "json2typescript";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";
import { PayFrequencyJsonConverter } from "~/Payetools.Common/Serialization/PayFrequencyJsonConverter";
import { Money } from "@dintero/money";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";
import { zeroGbp } from "~/CurrencyHelpers";

@JsonObject("HmrcIncomeTaxTestDataEntry")
export class HmrcIncomeTaxTestDataEntry implements IHmrcIncomeTaxTestDataEntry {
  @JsonProperty("DefinitionVersion", String)
  definitionVersion: string = "";

  @JsonProperty("TestIdentifier", String)
  testIdentifier: string = "";

  @JsonProperty("TaxYearEnding", TaxYearEndingJsonConverter)
  taxYearEnding: TaxYearEnding = TaxYearEnding.Unspecified;

  @JsonProperty("RelatesTo", String)
  relatesTo: string = "";

  @JsonProperty("PayFrequency", PayFrequencyJsonConverter)
  payFrequency: PayFrequency = PayFrequency.Unspecified;

  @JsonProperty("GrossPay", MoneyJsonConverter)
  grossPay: Money = zeroGbp;

  @JsonProperty("TaxablePayToDate", MoneyJsonConverter)
  taxablePayToDate: Money = zeroGbp;

  @JsonProperty("TaxCode", String)
  taxCode: string = "";

  @JsonProperty("W1M1Flag", String, true)
  w1M1Flag?: string;

  @JsonProperty("Period", Number)
  period: number = 0;

  @JsonProperty("TaxDueInPeriod", MoneyJsonConverter)
  taxDueInPeriod: Money = zeroGbp;

  @JsonProperty("TaxDueToDate", MoneyJsonConverter)
  taxDueToDate: Money = zeroGbp;
}
