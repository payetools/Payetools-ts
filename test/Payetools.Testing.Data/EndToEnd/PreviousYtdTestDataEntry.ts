// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IPreviousYtdTestDataEntry } from "./IPreviousYtdTestDataEntry";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";
import { JsonObject, JsonProperty } from "json2typescript";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";

@JsonObject("PreviousYtdTestDataEntry")
export class PreviousYtdTestDataEntry implements IPreviousYtdTestDataEntry {
  @JsonProperty("DefinitionVersion", String)
  definitionVersion: string = "";

  @JsonProperty("TestIdentifier", String)
  testIdentifier: string = "";

  @JsonProperty("TaxYearEnding", TaxYearEndingJsonConverter)
  taxYearEnding: TaxYearEnding = TaxYearEnding.Unspecified;

  @JsonProperty("TestReference", String)
  testReference: string = "";

  @JsonProperty("StatutoryMaternityPayYtd", MoneyJsonConverter)
  statutoryMaternityPayYtd: Money = zeroGbp;

  @JsonProperty("StatutoryPaternityPayYtd", MoneyJsonConverter)
  statutoryPaternityPayYtd: Money = zeroGbp;

  @JsonProperty("StatutoryAdoptionPayYtd", MoneyJsonConverter)
  statutoryAdoptionPayYtd: Money = zeroGbp;

  @JsonProperty("SharedParentalPayYtd", MoneyJsonConverter)
  sharedParentalPayYtd: Money = zeroGbp;

  @JsonProperty("StatutoryParentalBereavementPayYtd", MoneyJsonConverter)
  statutoryParentalBereavementPayYtd: Money = zeroGbp;

  @JsonProperty("GrossPayYtd", MoneyJsonConverter)
  grossPayYtd: Money = zeroGbp;

  @JsonProperty("TaxablePayYtd", MoneyJsonConverter)
  taxablePayYtd: Money = zeroGbp;

  @JsonProperty("NicablePayYtd", MoneyJsonConverter)
  nicablePayYtd: Money = zeroGbp;

  @JsonProperty("TaxPaidYtd", MoneyJsonConverter)
  taxPaidYtd: Money = zeroGbp;

  @JsonProperty("StudentLoanRepaymentsYtd", MoneyJsonConverter)
  studentLoanRepaymentsYtd: Money = zeroGbp;

  @JsonProperty("GraduateLoanRepaymentsYtd", MoneyJsonConverter)
  graduateLoanRepaymentsYtd: Money = zeroGbp;

  @JsonProperty("PayrolledBenefitsYtd", MoneyJsonConverter)
  payrolledBenefitsYtd: Money = zeroGbp;

  @JsonProperty("TaxUnpaidDueToRegulatoryLimit", MoneyJsonConverter)
  taxUnpaidDueToRegulatoryLimit: Money = zeroGbp;

  @JsonProperty("EmployerPensionContributionsYtd", MoneyJsonConverter)
  employerPensionContributionsYtd: Money = zeroGbp;

  @JsonProperty("EmployeePensionContributionsUnderNpaYtd", MoneyJsonConverter)
  employeePensionContributionsUnderNpaYtd: Money = zeroGbp;

  @JsonProperty("EmployeePensionContributionsUnderRasYtd", MoneyJsonConverter)
  employeePensionContributionsUnderRasYtd: Money = zeroGbp;
}
