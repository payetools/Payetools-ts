// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { ITaxCalculator } from "../ITaxCalculator";
import { Money } from "@dintero/money";

/**
 * Interface that represents the result of an income tax calculation. The purpose of this interface (and its implementations)
 * is to provide a richer set of data about the calculation than just the final tax due number. This can be helpful in
 * employee support situations in particular.
 */
export interface ITaxCalculationResult {
  /**
   * Gets the calculator (implementation of {@link ITaxCalculator}) used to perform this calculation.
   */
  get calculator(): ITaxCalculator;

  /**
   * Gets the {@link TaxCode} used in this calculation.
   */
  get taxCode(): TaxCode;

  /**
   * Gets the taxable salary used in this calculation. This is the gross salary less any tax-free pay (or plus any additional
   * notional pay in the case of K tax codes).
   */
  get taxableSalaryAfterTaxFreePay(): Money;

  /**
   * Gets the tax-free pay applicable to the end of the period, as given by the specified tax code. May be negative
   * in the case of K tax codes.
   */
  get taxFreePayToEndOfPeriod(): Money;

  /**
   * Gets the year to date taxable salary paid up to and including the end of the previous period.
   */
  get previousPeriodSalaryYearToDate(): Money;

  /**
   * Gets the year to date tax paid up to and including the end of the previous period.
   */
  get previousPeriodTaxPaidYearToDate(): Money;

  /**
   * Gets any unpaid tax due to the regulatory limit.
   * TODO: implement this properly.
   */
  get taxUnpaidDueToRegulatoryLimit(): Money;

  /**
   * Gets the tax due at the end of the period, based on the taxable earnings to the end of the period and
   * accounting for any tax-free pay up to the end of the period. This figure takes account of both the
   * effect of the regulatory limit and the effect of any unpaid taxes due to the effect of the regulatory
   * limit in previous periods.
   */
  get finalTaxDue(): Money;

  /**
   * Gets the tax due at the end of the period, based on the taxable earnings to the end of the period and
   * accounting for any tax-free pay up to the end of the period. This is before considering the effect of
   * regulatory limits.
   */
  get taxDueBeforeApplicationOfRegulatoryLimit(): Money;

  /**
   * Gets the numeric index of the highest tax band used in the calculation.
   */
  get highestApplicableTaxBandIndex(): number;

  /**
   * Gets the total income to date that falls within the highest tax band used in the calculation.
   */
  get incomeAtHighestApplicableBand(): Money;

  /**
   * Gets the total tax due for income to date that falls within the highest tax band used in the calculation.
   */
  get taxAtHighestApplicableBand(): Money;
}
