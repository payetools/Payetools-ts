// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export interface IPeriodInputTestDataEntry {
  definitionVersion: string;
  testIdentifier: string;
  taxYearEnding: TaxYearEnding;
  testReference: string;
  entryType: string;
  shortName: string;
  description: string;
  qty?: number;
  rate?: Big;
  fixedAmount?: Money;
  finalAmount: Money;
}
