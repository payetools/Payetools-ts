// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export interface IHmrcDirectorsNiTestDataEntry {
  definitionVersion: string;
  testIdentifier: string;
  taxYearEnding: TaxYearEnding;
  relatesTo: string;
  payFrequency: PayFrequency;
  grossPay: Money;
  period: number;
  niCategory: NiCategory;
  employeeNiContribution: Money;
  employerNiContribution: Money;
  totalNiContribution: Money;
  earningsAtLEL_YTD: Money;
  earningsLELtoPT_YTD: Money;
  earningsPTtoUEL_YTD: Money;
  totalEmployerContributions_YTD: Money;
  totalEmployeeContributions_YTD: Money;
  statusMethod: string;
  grossPayYtd: Big;
  employeeNiContributionYtd: Big;
  employerNiContributionYtd: Big;
  proRataFactor?: Big;
}
