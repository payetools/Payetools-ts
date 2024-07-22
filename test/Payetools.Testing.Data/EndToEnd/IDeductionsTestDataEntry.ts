// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

/**
 * Class representing a deductions test data entry
 */
export interface IDeductionsTestDataEntry {
  definitionVersion: string;
  testIdentifier: string;
  taxYearEnding: TaxYearEnding;
  shortName: string;
  description: string;
  reducesGrossPay: boolean;
  reducesTaxablePay: boolean;
  reducesNicablePay: boolean;
  reducesPensionablePay: boolean;
  isUnderSalaryExchangeArrangement: boolean;
}
