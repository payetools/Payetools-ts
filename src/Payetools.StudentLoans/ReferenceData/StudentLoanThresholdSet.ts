// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IStudentLoanThresholdSet } from "./IStudentLoanThresholdSet";

// Type that provides access to a specific set of student (and post-grad) loan
// thresholds for a given plan type and specific period.
export class StudentLoanThresholdSet implements IStudentLoanThresholdSet {
  /**
   * Gets the period threshold for Plan 1 student loan deductions.
   */
  public plan1PerPeriodThreshold: Money;

  /**
   * Gets the period threshold for Plan 2 student loan deductions.
   */
  public plan2PerPeriodThreshold: Money;

  /**
   * Gets the period threshold for Plan 4 student loan deductions.
   */
  public plan4PerPeriodThreshold: Money;

  /**
   * Gets the period threshold for post-graduate student loan deductions.
   */
  public postGradPerPeriodThreshold: Money;

  constructor(
    plan1PerPeriodThreshold: Money,
    plan2PerPeriodThreshold: Money,
    plan4PerPeriodThreshold: Money,
    postGradPerPeriodThreshold: Money,
  ) {
    this.plan1PerPeriodThreshold = plan1PerPeriodThreshold;
    this.plan2PerPeriodThreshold = plan2PerPeriodThreshold;
    this.plan4PerPeriodThreshold = plan4PerPeriodThreshold;
    this.postGradPerPeriodThreshold = postGradPerPeriodThreshold;
  }
}
