// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export interface IPreviousYtdTestDataEntry {
  definitionVersion: string;
  testIdentifier: string;
  taxYearEnding: TaxYearEnding;
  testReference: string;
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
  taxUnpaidDueToRegulatoryLimit: Money;
  employerPensionContributionsYtd: Money;
  employeePensionContributionsUnderNpaYtd: Money;
  employeePensionContributionsUnderRasYtd: Money;
}
