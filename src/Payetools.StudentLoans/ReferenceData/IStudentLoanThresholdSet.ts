// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";

/**
 * Interface for types that provide access to a specific set of student (and post-grad) loan
 * thresholds for a given plan type and specific period.
 */
export interface IStudentLoanThresholdSet {
  /**
   * Gets the period threshold for Plan 1 student loan deductions.
   */
  plan1PerPeriodThreshold: Money;

  /**
   * Gets the period threshold for Plan 2 student loan deductions.
   */
  plan2PerPeriodThreshold: Money;

  /**
   * Gets the period threshold for Plan 4 student loan deductions.
   */
  plan4PerPeriodThreshold: Money;

  /**
   * Gets the period threshold for post-graduate student loan deductions.
   */
  postGradPerPeriodThreshold: Money;
}
