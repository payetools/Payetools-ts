// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { IPensionContributionCalculator } from "./IPensionContributionCalculator";

/**
 * Interface that represents factories that can generate IPensionContributionCalculator implementations.
 */
export interface IPensionContributionCalculatorFactory {
  /**
   * Gets a new IPensionContributionCalculator based on the specified pay date and number of tax periods. The pay date
   * is provided in order to determine which set of thresholds (Qualifying Earnings only) and rates to use, noting that these may change
   * in-year.
   *
   * @param earningsBasis - Earnings basis for pension calculation (Qualifying Earnings vs Pensionable Pay Set x).
   * @param taxTreatment - Tax treatment (net pay arrangement vs relief at source).
   * @param payDate - Applicable pay date.
   * @returns A new calculator instance.
   */
  getCalculator(
    earningsBasis: PensionsEarningsBasis,
    taxTreatment: PensionTaxTreatment,
    payDate: PayDate,
  ): IPensionContributionCalculator;

  /**
   * Gets a new IPensionContributionCalculator based on the specified tax year, pay frequency and pay period, along with the
   * applicable number of tax periods. The tax year, pay frequency and pay period are provided in order to determine which
   * set of thresholds and rates to use, noting that these may change in-year.
   *
   * @param earningsBasis - Earnings basis for pension calculation (Qualifying Earnings vs Pensionable Pay Set x).
   * @param taxTreatment - Tax treatment (net pay arrangement vs relief at source).
   * @param taxYear - Applicable tax year.
   * @param payFrequency - Applicable pay frequency.
   * @param taxPeriod - Applicable tax period.
   * @returns A new calculator instance.
   */
  getCalculatorForPayFrequencyAndTaxPeriod(
    earningsBasis: PensionsEarningsBasis,
    taxTreatment: PensionTaxTreatment,
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): IPensionContributionCalculator;
}
