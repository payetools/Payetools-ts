// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { INiYtdHistoryTestDataEntry } from "./INiYtdHistoryTestDataEntry";
import { zeroGbp } from "~/CurrencyHelpers";
import { Money } from "@dintero/money";
import { JsonObject, JsonProperty } from "json2typescript";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";
import { NiCategoryJsonConverter } from "~/Payetools.ReferenceData/Serialization/NiCategoryJsonTypeConverter";

@JsonObject("NiYtdHistoryTestDataEntry")
export class NiYtdHistoryTestDataEntry implements INiYtdHistoryTestDataEntry {
  @JsonProperty("DefinitionVersion", String)
  definitionVersion: string = "";

  @JsonProperty("TestIdentifier", String)
  testIdentifier: string = "";

  @JsonProperty("TaxYearEnding", TaxYearEndingJsonConverter)
  taxYearEnding: TaxYearEnding = TaxYearEnding.Unspecified;

  @JsonProperty("TestReference", String)
  testReference: string = "";

  @JsonProperty("NiCategoryPertaining", NiCategoryJsonConverter)
  niCategoryPertaining: NiCategory = NiCategory.Unspecified;

  @JsonProperty("GrossNicableEarnings", MoneyJsonConverter)
  grossNicableEarnings: Money = zeroGbp;

  @JsonProperty("EmployeeContribution", MoneyJsonConverter)
  employeeContribution: Money = zeroGbp;

  @JsonProperty("EmployerContribution", MoneyJsonConverter)
  employerContribution: Money = zeroGbp;

  @JsonProperty("TotalContribution", MoneyJsonConverter)
  totalContribution: Money = zeroGbp;

  @JsonProperty("EarningsUpToAndIncludingLEL", MoneyJsonConverter)
  earningsUpToAndIncludingLEL: Money = zeroGbp;

  @JsonProperty("EarningsAboveLELUpToAndIncludingST", MoneyJsonConverter)
  earningsAboveLELUpToAndIncludingST: Money = zeroGbp;

  @JsonProperty("EarningsAboveSTUpToAndIncludingPT", MoneyJsonConverter)
  earningsAboveSTUpToAndIncludingPT: Money = zeroGbp;

  @JsonProperty("EarningsAbovePTUpToAndIncludingFUST", MoneyJsonConverter)
  earningsAbovePTUpToAndIncludingFUST: Money = zeroGbp;

  @JsonProperty("EarningsAboveFUSTUpToAndIncludingUEL", MoneyJsonConverter)
  earningsAboveFUSTUpToAndIncludingUEL: Money = zeroGbp;

  @JsonProperty("EarningsAboveUEL", MoneyJsonConverter)
  earningsAboveUEL: Money = zeroGbp;

  @JsonProperty("EarningsAboveSTUpToAndIncludingUEL", MoneyJsonConverter)
  earningsAboveSTUpToAndIncludingUEL: Money = zeroGbp;
}
