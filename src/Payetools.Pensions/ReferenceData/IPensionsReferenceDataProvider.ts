// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";

/**
 * Interface that classes implement in order to provide access to pensions reference data, i.e.,
 * rates and thresholds.
 */
export interface IPensionsReferenceDataProvider {
  /**
   * Gets the thresholds for Qualifying Earnings for the specified tax year and tax period, as denoted by the
   * supplied pay frequency and pay period.
   *
   * @param taxYear - Applicable tax year.
   * @param payFrequency - Applicable pay frequency.
   * @param taxPeriod - Applicable tax period.
   * @returns A tuple containing the lower and upper thresholds for the specified pay frequency and point in time.
   */
  getThresholdsForQualifyingEarnings(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): { lowerLimit: Money; upperLimit: Money };

  /**
   * Gets the basic rate of tax applicable across all tax regimes for relief at source pension contributions, for the specified
   * tax year.  (As at the time of writing, one basic rate of tax is used across all jurisdictions in spite of the fact that
   * some have a lower basic rate of tax.)
   *
   * @param taxYear - Applicable tax year.
   * @param payFrequency - Applicable pay frequency. Only used if there has been an in-year change.
   * @param taxPeriod - Applicable tax period. Only used if there has been an in-year change.
   * @returns Basic rate of tax applicable for the tax year.
   */
  getBasicRateOfTaxForTaxRelief(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): Big;
}
