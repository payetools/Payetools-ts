// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

/**
 * Represents an Employment Allowance history entry.
 */
export interface EmploymentAllowanceHistoryEntry {
  /**
   * Gets the tax year that this history entry pertains to.
   */
  relevantTaxYear: TaxYearEnding;

  /**
   * Gets a value indicating whether the employer is eligible to claim Employment Allowance.
   */
  isEligible: boolean;
}
