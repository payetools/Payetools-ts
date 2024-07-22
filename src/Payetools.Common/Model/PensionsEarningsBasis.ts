// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Represents the earnings basis which is used to calculate pension contributions.
 *
 * Note that this enum is marked with the [Flags] attribute so that it can be used as an indicator for
 * pension schemes to indicate which earnings bases they support.
 */
export enum PensionsEarningsBasis {
  /** Not specified. */
  Unspecified = 0,

  /**
   * Qualifying Earnings includes salary, wages, commission, bonuses, overtime, statutory sick pay, statutory maternity pay,
   * ordinary or additional statutory paternity pay and statutory adoption pay.
   *
   * Qualifying earnings is calculated from pensionable pay deducting a lower threshold and capping at an upper threshold, the
   * thresholds being decided by Government each year.
   */
  QualifyingEarnings = 1,

  /**
   * Pensionable Pay Set 1 contributions are worked out on at least basic pay. Basic pay includes at a minimum, earnings
   * before deductions, holiday pay and statutory benefits such as maternity, paternity, adoption and sick pay delivered through
   * payroll.
   */
  PensionablePaySet1 = 2,

  /**
   * Pensionable Pay Set 2 contributions are worked out on at least basic pay, but the key difference between this and
   * Set 1 is that basic pay must make up at least 85% of total earnings. The employer must monitor this.
   */
  PensionablePaySet2 = 4,

  /**
   * Pensionable Pay Set 2 contributions includes salary, wages, commission, bonuses, overtime, statutory sick pay,
   * statutory maternity pay, ordinary or additional statutory paternity pay and statutory adoption pay.
   */
  PensionablePaySet3 = 8,

  /**
   * Only PensionablePaySets 1 through 3 are supported.
   */
  PensionablePaySetsOnly = 14,

  /**
   * All earnings bases are supported.
   */
  All = 15,
}
