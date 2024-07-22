// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { StudentLoanType } from "~/Payetools.Common/Model/StudentLoanType";
import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export interface IStaticInputTestDataEntry {
  definitionVersion: string;
  testIdentifier: string;
  taxYearEnding: TaxYearEnding;
  testReference: string;
  employeeFirstName: string;
  employeeLastName: string;
  taxCode: TaxCode;
  niCategory: NiCategory;
  studentLoanPlan?: StudentLoanType;
  graduateLoan: boolean;
  pensionScheme?: string;
  usesSalaryExchange: boolean;
  employeePercentage?: Big;
  employeeFixedAmount?: Money;
  employerPercentage?: Big;
}
