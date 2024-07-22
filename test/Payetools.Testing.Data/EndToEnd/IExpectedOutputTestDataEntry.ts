// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export interface IExpectedOutputTestDataEntry {
  definitionVersion: string;
  testIdentifier: string;
  taxYearEnding: TaxYearEnding;
  testReference: string;
  statutoryMaternityPay: Money;
  statutoryPaternityPay: Money;
  statutoryAdoptionPay: Money;
  sharedParentalPay: Money;
  statutoryParentalBereavementPay: Money;
  grossPay: Money;
  taxablePay: Money;
  nicablePay: Money;
  taxPaid: Money;
  employeeNiContribution: Money;
  employerNiContribution: Money;
  studentLoanRepayments: Money;
  graduateLoanRepayments: Money;
  payrolledBenefits: Money;
  taxUnpaidDueToRegulatoryLimit: Money;
  employerPensionContribution: Money;
  pensionUnderNpa: boolean;
  employeePensionContribution: Money;
  otherDeductions: Money;
  netPay: Money;
  statutoryMaternityPayYtd: Money;
  statutoryPaternityPayYtd: Money;
  statutoryAdoptionPayYtd: Money;
  sharedParentalPayYtd: Money;
  statutoryParentalBereavementPayYtd: Money;
  grossPayYtd: Money;
  taxablePayYtd: Money;
  nicablePayYtd: Money;
  taxPaidYtd: Money;
  studentLoanRepaymentsYtd: Money;
  graduateLoanRepaymentsYtd: Money;
  payrolledBenefitsYtd: Money;
  taxUnpaidDueToRegulatoryLimitYtd: Money;
  employerPensionContributionYtd: Money;
  employeePensionContributionsUnderNpaYtd: Money;
  employeePensionContributionsUnderRasYtd: Money;
}
