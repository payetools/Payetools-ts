// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import {
  PayFrequency,
  PayFrequencyExtensions,
} from "~/Payetools.Common/Model/PayFrequency";
import { NiThresholdType } from "../Model/NiThresholdType";
import { INiThresholdEntry } from "./INiThresholdEntry";
import { Money } from "@dintero/money";
import {
  RoundDown,
  RoundHalfEven,
  RoundHalfUp,
  RoundUp,
  gbp,
} from "~/CurrencyHelpers";

/**
 * Represents a specific National Insurance threshold (e.g., LEL, UEL) adjusted for a specific pay frequency and
 * number of periods, as NI is calculated based on the appropriate fraction of the applicable annual threshold.
 */
export class NiPeriodThresholdEntry {
  /**
   * Gets the type of this threshold entry (e.g., LEL, PT, ST, etc.).
   */
  public thresholdType: NiThresholdType;

  /**
   * Gets the applicable pay frequency for this period threshold.
   */
  public payFrequency: PayFrequency;

  /**
   * Gets the number of tax periods applicable for this period threshold.
   */
  public numberOfTaxPeriods: number;

  /**
   * Gets the base threshold for the period, as distinct from `thresholdForPeriod1` (see below).
   */
  public thresholdForPeriod: Money;

  /**
   * Gets the modified threshold for the period (as distinct from `thresholdForPeriod`) where rounding is
   * applied based on whether the pay frequency is weekly or monthly, or otherwise. As detailed in HMRC's NI calculation
   * documentation as 'p1'.
   */
  public thresholdForPeriod1: Money;

  /**
   * Initialises a new instance of `NiPeriodThresholdEntry` based on the supplied annual threshold,
   * specified pay frequency and optional number of tax periods.
   * @param baseEntry Annual threshold entry to calculate period threshold from.
   * @param payFrequency Applicable pay frequency.
   * @param numberOfTaxPeriods Number of pay periods. Defaults to 1.
   */
  constructor(
    baseEntry: INiThresholdEntry,
    payFrequency: PayFrequency,
    numberOfTaxPeriods: number = 1,
  ) {
    this.thresholdType = baseEntry.thresholdType;
    this.payFrequency = payFrequency;
    this.numberOfTaxPeriods = numberOfTaxPeriods;

    // * This is what we might expect for obtaining the correct threshold for the period. But HMRC guidance is that
    // * we MUST always use the annual figure divided by the number of periods in the tax year.
    //
    // thresholdForPeriod = payFrequency switch
    // {
    //    PayFrequency.Weekly => baseEntry.ThresholdValuePerWeek * TaxPeriod,
    //    PayFrequency.TwoWeekly => baseEntry.ThresholdValuePerWeek * TaxPeriod * 2,
    //    PayFrequency.FourWeekly => baseEntry.ThresholdValuePerWeek * TaxPeriod * 4,
    //    PayFrequency.Monthly => baseEntry.ThresholdValuePerMonth * TaxPeriod,
    //    PayFrequency.Annually => baseEntry.ThresholdValuePerYear,
    //    _ => throw new ArgumentException("Unrecognised PayFrequency value", nameof(payFrequency))
    // };
    //
    // (On this basis, ThresholdValuePerWeek and ThresholdValuePerMonth are excluded from INiThresholdEntry.)

    const rawThresholdForPeriod = baseEntry.thresholdValuePerYear
      .amount()
      .div(
        PayFrequencyExtensions.getStandardTaxPeriodCount(payFrequency) *
          numberOfTaxPeriods,
      );

    // From HMRC documentation: 'p' = number of weeks/months in pay period. Round result of calculation at this point
    // up to nearest whole pound.
    this.thresholdForPeriod = gbp(rawThresholdForPeriod.round(0, RoundUp));

    const useStandardRoundingApproach =
      (payFrequency === PayFrequency.Weekly ||
        payFrequency === PayFrequency.Monthly) &&
      numberOfTaxPeriods === 1;

    // From HMRC documentation: 'p1' = number of weeks/months in pay period. If equals 1 round result of calculation
    // at this point to nearest whole pound. If more than 1 round up to whole pounds.
    this.thresholdForPeriod1 = gbp(
      useStandardRoundingApproach
        ? rawThresholdForPeriod.round(0, RoundHalfUp)
        : rawThresholdForPeriod.round(0, RoundUp),
    );
  }

  /**
   * Gets a string representation of this `NiPeriodThresholdEntry`.
   * @returns String representation of this instance.
   */
  public toString(): string {
    return `${this.thresholdType}: ${this.payFrequency} (${this.thresholdForPeriod}, ${this.thresholdForPeriod1})`;
  }
}
