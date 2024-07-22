// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IHmrcDirectorsNiTestDataEntry } from "./IHmrcDirectorsNiTestDataEntry";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";
import Big from "big.js";
import { JsonObject, JsonProperty } from "json2typescript";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";
import { PayFrequencyJsonConverter } from "~/Payetools.Common/Serialization/PayFrequencyJsonConverter";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";
import { NiCategoryJsonConverter } from "~/Payetools.ReferenceData/Serialization/NiCategoryJsonTypeConverter";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";

@JsonObject("HmrcDirectorsNiTestDataEntry")
export class HmrcDirectorsNiTestDataEntry
  implements IHmrcDirectorsNiTestDataEntry
{
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

  @JsonProperty("Period", Number)
  period: number = 0;

  @JsonProperty("NiCategory", NiCategoryJsonConverter)
  niCategory: NiCategory = NiCategory.Unspecified;

  @JsonProperty("EmployeeNiContribution", MoneyJsonConverter)
  employeeNiContribution: Money = zeroGbp;

  @JsonProperty("EmployerNiContribution", MoneyJsonConverter)
  employerNiContribution: Money = zeroGbp;

  @JsonProperty("TotalNiContribution", MoneyJsonConverter)
  totalNiContribution: Money = zeroGbp;

  @JsonProperty("EarningsAtLEL_YTD", MoneyJsonConverter)
  earningsAtLEL_YTD: Money = zeroGbp;

  @JsonProperty("EarningsLELtoPT_YTD", MoneyJsonConverter)
  earningsLELtoPT_YTD: Money = zeroGbp;

  @JsonProperty("EarningsPTtoUEL_YTD", MoneyJsonConverter)
  earningsPTtoUEL_YTD: Money = zeroGbp;

  @JsonProperty("TotalEmployerContributions_YTD", MoneyJsonConverter)
  totalEmployerContributions_YTD: Money = zeroGbp;

  @JsonProperty("TotalEmployeeContributions_YTD", MoneyJsonConverter)
  totalEmployeeContributions_YTD: Money = zeroGbp;

  @JsonProperty("StatusMethod", String)
  statusMethod: string = "";

  @JsonProperty("GrossPayYtd", BigJsonConverter)
  grossPayYtd: Big = Big(0);

  @JsonProperty("EmployeeNiContributionYtd", BigJsonConverter)
  employeeNiContributionYtd: Big = Big(0);

  @JsonProperty("EmployerNiContributionYtd", BigJsonConverter)
  employerNiContributionYtd: Big = Big(0);

  @JsonProperty("ProRataFactor", BigJsonConverter, true)
  proRataFactor?: Big;
}
