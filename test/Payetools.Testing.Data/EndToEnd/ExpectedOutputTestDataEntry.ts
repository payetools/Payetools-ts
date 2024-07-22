// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IExpectedOutputTestDataEntry } from "./IExpectedOutputTestDataEntry";
import { JsonObject, JsonProperty } from "json2typescript";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";

@JsonObject("ExpectedOutputTestDataEntry")
export class ExpectedOutputTestDataEntry
  implements IExpectedOutputTestDataEntry
{
  @JsonProperty("DefinitionVersion", String)
  definitionVersion: string = "";

  @JsonProperty("TestIdentifier", String)
  testIdentifier: string = "";

  @JsonProperty("TaxYearEnding", TaxYearEndingJsonConverter)
  taxYearEnding: TaxYearEnding = TaxYearEnding.Unspecified;

  @JsonProperty("TestReference", String)
  testReference: string = "";

  @JsonProperty("StatutoryMaternityPay", MoneyJsonConverter)
  statutoryMaternityPay: Money = zeroGbp;

  @JsonProperty("StatutoryPaternityPay", MoneyJsonConverter)
  statutoryPaternityPay: Money = zeroGbp;

  @JsonProperty("StatutoryAdoptionPay", MoneyJsonConverter)
  statutoryAdoptionPay: Money = zeroGbp;

  @JsonProperty("SharedParentalPay", MoneyJsonConverter)
  sharedParentalPay: Money = zeroGbp;

  @JsonProperty("StatutoryParentalBereavementPay", MoneyJsonConverter)
  statutoryParentalBereavementPay: Money = zeroGbp;

  @JsonProperty("GrossPay", MoneyJsonConverter)
  grossPay: Money = zeroGbp;

  @JsonProperty("TaxablePay", MoneyJsonConverter)
  taxablePay: Money = zeroGbp;

  @JsonProperty("NicablePay", MoneyJsonConverter)
  nicablePay: Money = zeroGbp;

  @JsonProperty("TaxPaid", MoneyJsonConverter)
  taxPaid: Money = zeroGbp;

  @JsonProperty("EmployeeNiContribution", MoneyJsonConverter)
  employeeNiContribution: Money = zeroGbp;

  @JsonProperty("EmployerNiContribution", MoneyJsonConverter)
  employerNiContribution: Money = zeroGbp;

  @JsonProperty("StudentLoanRepayments", MoneyJsonConverter)
  studentLoanRepayments: Money = zeroGbp;

  @JsonProperty("GraduateLoanRepayments", MoneyJsonConverter)
  graduateLoanRepayments: Money = zeroGbp;

  @JsonProperty("PayrolledBenefits", MoneyJsonConverter)
  payrolledBenefits: Money = zeroGbp;

  @JsonProperty("TaxUnpaidDueToRegulatoryLimit", MoneyJsonConverter)
  taxUnpaidDueToRegulatoryLimit: Money = zeroGbp;

  @JsonProperty("EmployerPensionContribution", MoneyJsonConverter)
  employerPensionContribution: Money = zeroGbp;

  @JsonProperty("PensionUnderNpa", Boolean)
  pensionUnderNpa: boolean = false;

  @JsonProperty("EmployeePensionContribution", MoneyJsonConverter)
  employeePensionContribution: Money = zeroGbp;

  @JsonProperty("OtherDeductions", MoneyJsonConverter)
  otherDeductions: Money = zeroGbp;

  @JsonProperty("NetPay", MoneyJsonConverter)
  netPay: Money = zeroGbp;

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

  @JsonProperty("TaxUnpaidDueToRegulatoryLimitYtd", MoneyJsonConverter)
  taxUnpaidDueToRegulatoryLimitYtd: Money = zeroGbp;

  @JsonProperty("EmployerPensionContributionYtd", MoneyJsonConverter)
  employerPensionContributionYtd: Money = zeroGbp;

  @JsonProperty("EmployeePensionContributionsUnderNpaYtd", MoneyJsonConverter)
  employeePensionContributionsUnderNpaYtd: Money = zeroGbp;

  @JsonProperty("EmployeePensionContributionsUnderRasYtd", MoneyJsonConverter)
  employeePensionContributionsUnderRasYtd: Money = zeroGbp;
}
