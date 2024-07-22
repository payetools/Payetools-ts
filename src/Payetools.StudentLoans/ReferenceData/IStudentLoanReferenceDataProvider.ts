// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { IStudentLoanThresholdSet } from "./IStudentLoanThresholdSet";
import { IStudentLoanRateSet } from "./IStudentLoanRateSet";

/**
 * Interface that classes implement in order to provide access to student loan reference data.
 */
export interface IStudentLoanReferenceDataProvider {
  /**
   * Gets the set of annual thresholds to be applied for a given tax year and tax period.
   * @param taxYear - Applicable tax year.
   * @param payFrequency - Applicable pay frequency.
   * @param taxPeriod - Applicable tax period.
   * @returns An implementation of IStudentLoanThresholdSet that provides the appropriate set of annual
   * thresholds for the specified point.
   */
  getStudentLoanThresholdsForTaxYearAndPeriod(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): IStudentLoanThresholdSet;

  /**
   * Gets the student and post graduate deduction rates for the specified tax year and tax period, as denoted
   * by the supplied pay frequency and pay period.
   * @param taxYear - Applicable tax year.
   * @param payFrequency - Applicable pay frequency.
   * @param taxPeriod - Applicable tax period.
   * @returns An instance of IStudentLoanRateSet containing the rates for the specified point
   * in time.
   */
  getStudentLoanRatesForTaxYearAndPeriod(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): IStudentLoanRateSet;
}
