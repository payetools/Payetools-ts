// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IDeductionsTestDataEntry } from "./IDeductionsTestDataEntry";
import { JsonObject, JsonProperty } from "json2typescript";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";

/**
 * Class representing a deductions test data entry
 */
@JsonObject("DeductionsTestDataEntry")
export class DeductionsTestDataEntry implements IDeductionsTestDataEntry {
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

  @JsonProperty("ReducesGrossPay", Boolean)
  reducesGrossPay: boolean = false;

  @JsonProperty("ReducesTaxablePay", Boolean)
  reducesTaxablePay: boolean = false;

  @JsonProperty("ReducesNicablePay", Boolean)
  reducesNicablePay: boolean = false;

  @JsonProperty("ReducesPensionablePay", Boolean)
  reducesPensionablePay: boolean = false;

  @JsonProperty("IsUnderSalaryExchangeArrangement", Boolean)
  isUnderSalaryExchangeArrangement: boolean = false;
}
