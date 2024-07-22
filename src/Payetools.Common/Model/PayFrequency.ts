// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ArgumentException } from "../Diagnostics/ArgumentException";

// Enumerated value for payment frequency.
export enum PayFrequency {
  // Not specified
  Unspecified = "Unspecified",

  // Weekly
  Weekly = "Weekly",

  // Every two weeks
  Fortnightly = "Fortnightly",

  // Every four weeks
  FourWeekly = "FourWeekly",

  // Monthly
  Monthly = "Monthly",

  // Every three months
  Quarterly = "Quarterly",

  // Every six months
  BiAnnually = "BiAnnually",

  // Once a year
  Annually = "Annually",

  // Equivalent to fortnightly (retained for backwards-compatibility).
  TwoWeekly = Fortnightly,
}

// Extension methods for PayFrequency.
export class PayFrequencyExtensions {
  // Provides access to the number of tax periods within a tax year for a given PayFrequency.
  // @param payFrequency PayFrequency to provide period count for.
  // @returns The number of tax periods within a tax year for a this PayFrequency, for example, PayFrequency.Monthly returns 12.
  // @exception ArgumentException Thrown if an invalid PayFrequency value is supplied.
  static getStandardTaxPeriodCount(payFrequency: PayFrequency): number {
    switch (payFrequency) {
      case PayFrequency.Weekly:
        return 52;
      case PayFrequency.Fortnightly:
        return 26;
      case PayFrequency.FourWeekly:
        return 13;
      case PayFrequency.Monthly:
        return 12;
      case PayFrequency.Quarterly:
        return 4;
      case PayFrequency.BiAnnually:
        return 2;
      case PayFrequency.Annually:
        return 1;
      default:
        throw new ArgumentException(
          `Invalid pay frequency value ${payFrequency}`,
          "payFrequency",
        );
    }
  }

  // Provides access to the number of tax periods within a tax year for a given PayFrequency.
  // @param payFrequency PayFrequency to provide period count for.
  // @returns The number of tax periods within a tax year for a this PayFrequency, for example, PayFrequency.Monthly returns 12.
  // @exception ArgumentException Thrown if an invalid PayFrequency value is supplied.
  static getTaxPeriodLength(payFrequency: PayFrequency): number {
    switch (payFrequency) {
      case PayFrequency.Weekly:
        return 7;
      case PayFrequency.Fortnightly:
        return 14;
      case PayFrequency.FourWeekly:
        return 28;
      case PayFrequency.Monthly:
        return 12;
      case PayFrequency.Quarterly:
        return 4;
      case PayFrequency.BiAnnually:
        return 2;
      case PayFrequency.Annually:
        return 1;
      default:
        throw new ArgumentException(
          `Invalid pay frequency value ${payFrequency}`,
          "payFrequency",
        );
    }
  }

  // Determines whether the specified tax period is the last tax period in the tax year.
  // @param payFrequency Relevant pay frequency.
  // @param taxPeriod Tax period to evaluate.
  // @param applyWeek53Treatment Flag that indicates whether to apply "week 53" treatment, i.e., where
  // there are 53 weeks in a tax year (or 27 periods in a two-weekly pay cycle, etc.).  Must be false
  // for monthly, quarterly and annual payrolls.  Optional, defaulting to false.
  // @returns true if the supplied tax period is the last period in the tax year; false otherwise.
  static isLastTaxPeriodInTaxYear(
    payFrequency: PayFrequency,
    taxPeriod: number,
    applyWeek53Treatment: boolean = false,
  ): boolean {
    if (
      applyWeek53Treatment &&
      (payFrequency === PayFrequency.Monthly ||
        payFrequency === PayFrequency.Quarterly ||
        payFrequency === PayFrequency.Annually)
    ) {
      throw new ArgumentException(
        `Parameter must be false for non-week-based payrolls`,
        "applyWeek53Treatment",
      );
    }

    return (
      taxPeriod ===
      PayFrequencyExtensions.getStandardTaxPeriodCount(payFrequency) +
        (applyWeek53Treatment ? 1 : 0)
    );
  }
}
