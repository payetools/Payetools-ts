// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export interface IEarningsTestDataEntry {
  definitionVersion: string;
  testIdentifier: string;
  taxYearEnding: TaxYearEnding;
  shortName: string;
  description: string;
  isSubjectToTax: boolean;
  isSubjectToNi: boolean;
  isPensionable: boolean;
  isNetToGross: boolean;
  isTreatedAsOvertime: boolean;
}
