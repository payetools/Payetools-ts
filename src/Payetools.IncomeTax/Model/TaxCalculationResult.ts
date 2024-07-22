// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { ITaxCalculator } from "../ITaxCalculator";
import { Money } from "@dintero/money";

/**
 * Represents the result of an income tax calculation for an individual, providing the tax due plus a rich set of information about
 * how the result was achieved.
 */
export class TaxCalculationResult {
  /**
   * Gets the calculator (implementation of ITaxCalculator) used to perform this calculation.
   */
  public readonly calculator: ITaxCalculator;

  /**
   * Gets the TaxCode used in this calculation.
   */
  public readonly taxCode: TaxCode;

  /**
   * Gets the taxable salary used in this calculation.  This is the gross salary less any tax-free pay (or plus any additional
   * notional pay in the case of K tax codes).
   */
  public readonly taxableSalaryAfterTaxFreePay: Money;

  /**
   * Gets the tax-free pay applicable to the end of the period, as given by the specified tax code.  May be negative
   * in the case of K tax codes.
   */
  public readonly taxFreePayToEndOfPeriod: Money;

  /**
   * Gets the year to date taxable salary paid up to and including the end of the previous period.
   */
  public readonly previousPeriodSalaryYearToDate: Money;

  /**
   * Gets the year to date tax paid up to and including the end of the previous period.
   */
  public readonly previousPeriodTaxPaidYearToDate: Money;

  /**
   * Gets any unpaid tax due to the regulatory limit.
   * TODO: implement this properly.
   */
  public readonly taxUnpaidDueToRegulatoryLimit: Money;

  /**
   * Gets the tax due at the end of the period, based on the taxable earnings to the end of the period and
   * accounting for any tax-free pay up to the end of the period.  This figure takes account of both the
   * effect of the regulatory limit and the effect of any unpaid taxes due to the effect of the regulatory
   * limit in previous periods.
   */
  public readonly finalTaxDue: Money;

  /**
   * Gets the tax due at the end of the period, based on the taxable earnings to the end of the period and
   * accounting for any tax-free pay up to the end of the period.  This is before considering the effect of
   * regulatory limits.
   */
  public readonly taxDueBeforeApplicationOfRegulatoryLimit: Money;

  /**
   * Gets the numeric index of the highest tax band used in the calculation.
   */
  public readonly highestApplicableTaxBandIndex: number;

  /**
   * Gets the total income to date that falls within the highest tax band used in the calculation.
   */
  public readonly incomeAtHighestApplicableBand: Money;

  /**
   * Gets the total tax due for income to date that falls within the highest tax band used in the calculation.
   */
  public readonly taxAtHighestApplicableBand: Money;

  /**
   * Initializes a new instance of TaxCalculationResult using the supplied parameters.
   * @param calculator Calculator (implementation of ITaxCalculator) used to perform this calculation.
   * @param taxCode TaxCode used in this calculation.
   * @param taxFreePayToEndOfPeriod Tax-free pay applicable to the end of the period, derived from the specified tax code.
   * @param taxableSalary Taxable salary used in this calculation.
   * @param previousPeriodSalaryYearToDate Year to date taxable salary paid up to and including the end of the previous period.
   * @param previousPeriodTaxPaidYearToDate Year to date tax paid up to and including the end of the previous period.
   * @param highestApplicableTaxBandIndex Numeric index of the highest tax band used in the calculation.
   * @param incomeAtHighestApplicableBand Total income to date that falls within the highest tax band used in the calculation.
   * @param taxAtHighestApplicableBand Total tax due for income to date that falls within the highest tax band used in the calculation.
   * @param taxUnpaidDueToRegulatoryLimit Previous period tax unpaid due to regulatory limit.
   * @param taxDueBeforeRegulatoryLimitEffects Tax due before considering the effects of regulatory limits.
   * @param finalTaxDue Tax due at the end of the period, based on the taxable earnings to the end of the period and
   * accounting for any tax-free pay up to the end of the period, accounting for the effects of regulatory limits, both from this
   * period and any prior periods.
   */
  constructor(
    calculator: ITaxCalculator,
    taxCode: TaxCode,
    taxFreePayToEndOfPeriod: Money,
    taxableSalary: Money,
    previousPeriodSalaryYearToDate: Money,
    previousPeriodTaxPaidYearToDate: Money,
    highestApplicableTaxBandIndex: number,
    incomeAtHighestApplicableBand: Money,
    taxAtHighestApplicableBand: Money,
    taxUnpaidDueToRegulatoryLimit: Money,
    taxDueBeforeRegulatoryLimitEffects: Money,
    finalTaxDue: Money,
  ) {
    this.calculator = calculator;
    this.taxCode = taxCode;
    this.taxFreePayToEndOfPeriod = taxFreePayToEndOfPeriod;
    this.highestApplicableTaxBandIndex = highestApplicableTaxBandIndex;
    this.incomeAtHighestApplicableBand = incomeAtHighestApplicableBand;
    this.taxAtHighestApplicableBand = taxAtHighestApplicableBand;
    this.taxableSalaryAfterTaxFreePay = taxableSalary;
    this.previousPeriodSalaryYearToDate = previousPeriodSalaryYearToDate;
    this.previousPeriodTaxPaidYearToDate = previousPeriodTaxPaidYearToDate;
    this.taxUnpaidDueToRegulatoryLimit = taxUnpaidDueToRegulatoryLimit;
    this.taxDueBeforeApplicationOfRegulatoryLimit =
      taxDueBeforeRegulatoryLimitEffects;
    this.finalTaxDue = finalTaxDue;
  }
}
