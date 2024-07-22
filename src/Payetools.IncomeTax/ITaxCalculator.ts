// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { ITaxCalculationResult } from "./Model/ITaxCalculationResult";
import { TaxPeriodBandwidthSet } from "./ReferenceData/TaxPeriodBandwidthSet";
import { Money } from "@dintero/money";

/**
 * Interface that represents a calculator for calculating income tax based on tax code, taxable income and tax paid to date.
 * Access to tax calculators is through the `TaxCalculatorFactory`; in normal use, implementations of ITaxCalculator
 * are not be created directly.  An ITaxCalculator instance is specific to a given pay frequency and tax period, which
 * corresponds to an instance of a given `PayDate`.
 */
export interface ITaxCalculator {
  /**
   * Gets the tax year that this calculator pertains to.
   */
  taxYear: TaxYear;

  /**
   * Gets the set of pro-rata tax bandwidths in use for a given tax year, tax regime and tax period.
   */
  taxBandwidths: TaxPeriodBandwidthSet;

  /**
   * Gets the pay frequency for this calculator.
   */
  payFrequency: PayFrequency;

  /**
   * Gets the relevant tax period for this calculator.
   */
  taxPeriod: number;

  /**
   * Gets the number of tax periods within a given tax year, based on the supplied pay frequency.
   */
  taxPeriodCount: number;

  /**
   * Calculates the tax due based on tax code, total taxable salary and total tax paid to date.
   * @param totalTaxableSalaryInPeriod Taxable pay in period (i.e., gross less pre-tax deductions but including benefits in kind).
   * @param benefitsInKind Benefits in kind element of the taxable pay for the period.
   * @param taxCode Individual's tax code.
   * @param taxableSalaryYearToDate Total year to date taxable salary up to and including the end of the previous tax period.
   * @param taxPaidYearToDate Total year to date tax paid up to and including the end of the previous tax period.
   * @param taxUnpaidDueToRegulatoryLimit Any tax outstanding due to the effect of the regulatory limit.
   * @param result An `ITaxCalculationResult` containing the tax now due plus related information from the tax calculation.
   */
  calculate(
    totalTaxableSalaryInPeriod: Money,
    benefitsInKind: Money,
    taxCode: TaxCode,
    taxableSalaryYearToDate: Money,
    taxPaidYearToDate: Money,
    taxUnpaidDueToRegulatoryLimit: Money,
  ): ITaxCalculationResult;
}
