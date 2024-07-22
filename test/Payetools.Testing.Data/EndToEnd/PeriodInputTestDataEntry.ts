// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IPeriodInputTestDataEntry } from "./IPeriodInputTestDataEntry";
import { JsonObject, JsonProperty } from "json2typescript";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";

@JsonObject("PeriodInputTestDataEntry")
export class PeriodInputTestDataEntry implements IPeriodInputTestDataEntry {
  @JsonProperty("DefinitionVersion", String)
  definitionVersion: string = "";

  @JsonProperty("TestIdentifier", String)
  testIdentifier: string = "";

  @JsonProperty("TaxYearEnding", TaxYearEndingJsonConverter)
  taxYearEnding: TaxYearEnding;

  @JsonProperty("TestReference", String)
  testReference: string = "";

  @JsonProperty("EntryType", String)
  entryType: string = "";

  @JsonProperty("ShortName", String)
  shortName: string = "";

  @JsonProperty("Description", String)
  description: string = "";

  @JsonProperty("Qty", Number, true)
  qty?: number;

  @JsonProperty("Rate", BigJsonConverter, true)
  rate?: Big;

  @JsonProperty("FixedAmount", MoneyJsonConverter, true)
  fixedAmount?: Money;

  @JsonProperty("FinalAmount", MoneyJsonConverter)
  finalAmount: Money;

  constructor() {
    this.taxYearEnding = TaxYearEnding.Unspecified;
    this.finalAmount = zeroGbp;
  }
}
