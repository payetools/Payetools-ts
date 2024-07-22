// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IEarningsTestDataEntry } from "./IEarningsTestDataEntry";
import { JsonObject, JsonProperty } from "json2typescript";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";

@JsonObject("EarningsTestDataEntry")
export class EarningsTestDataEntry implements IEarningsTestDataEntry {
  @JsonProperty("DefinitionVersion", String)
  definitionVersion: string = "";

  @JsonProperty("TestIdentifier", String)
  testIdentifier: string = "";

  @JsonProperty("TaxYearEnding", TaxYearEndingJsonConverter)
  taxYearEnding: TaxYearEnding = TaxYearEnding.Unspecified;

  @JsonProperty("ShortName", String)
  shortName: string = "";

  @JsonProperty("Description", String)
  description: string = "";

  @JsonProperty("IsSubjectToTax", Boolean)
  isSubjectToTax: boolean = false;

  @JsonProperty("IsSubjectToNi", Boolean)
  isSubjectToNi: boolean = false;

  @JsonProperty("IsPensionable", Boolean)
  isPensionable: boolean = false;

  @JsonProperty("IsNetToGross", Boolean)
  isNetToGross: boolean = false;

  @JsonProperty("IsTreatedAsOvertime", Boolean)
  isTreatedAsOvertime: boolean = false;
}
