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
import { IPensionContributionCalculatorFactory } from "./IPensionContributionCalculatorFactory";
import { PensionablePaySetCalculator } from "./PensionablePaySetCalculator";
import { IPensionsReferenceDataProvider } from "./ReferenceData/IPensionsReferenceDataProvider";
import { QualifyingEarningsContributionsCalculator } from "./QualifyingEarningsContributionsCalculator";

/**
 * Factory to generate IPensionContributionCalculator implementations that are for a given pay date,
 * pay frequency, earnings basis and tax treatment.
 */
export class PensionContributionCalculatorFactory
  implements IPensionContributionCalculatorFactory
{
  private provider: IPensionsReferenceDataProvider;

  /**
   * Initializes a new instance of PensionContributionCalculatorFactory with the supplied reference data provider.
   * @param provider Reference data provider for pensions.
   */
  constructor(provider: IPensionsReferenceDataProvider) {
    this.provider = provider;
  }

  /**
   * Gets a new IPensionContributionCalculator based on the specified pay date and number of tax periods. The pay date
   * is provided in order to determine which set of thresholds (Qualifying Earnings only) and rates to use, noting that these may change
   * in-year.
   * @param earningsBasis Earnings basis for pension calculation (Qualifying Earnings vs Pensionable Pay Set x).
   * @param taxTreatment Tax treatment (net pay arrangement vs relief at source).
   * @param payDate Applicable pay date.
   * @returns A new calculator instance.
   * @throws {Error} Thrown if an unsupported earnings basis is provided.
   */
  getCalculator(
    earningsBasis: PensionsEarningsBasis,
    taxTreatment: PensionTaxTreatment,
    payDate: PayDate,
  ): IPensionContributionCalculator {
    return this.getCalculatorForPayFrequencyAndTaxPeriod(
      earningsBasis,
      taxTreatment,
      payDate.taxYear,
      payDate.payFrequency,
      payDate.taxPeriod,
    );
  }

  /**
   * Gets a new IPensionContributionCalculator based on the specified tax year, pay frequency and pay period, along with the
   * applicable number of tax periods. The tax year, pay frequency and pay period are provided in order to determine which
   * set of thresholds and rates to use, noting that these may (but rarely do) change in-year.
   * @param earningsBasis Earnings basis for pension calculation (Qualifying Earnings vs Pensionable Pay Set x).
   * @param taxTreatment Tax treatment (net pay arrangement vs relief at source).
   * @param taxYear Applicable tax year.
   * @param payFrequency Applicable pay frequency.
   * @param taxPeriod Applicable tax period.
   * @returns A new calculator instance.
   * @throws {Error} Thrown if an unsupported earnings basis is provided.
   */
  getCalculatorForPayFrequencyAndTaxPeriod(
    earningsBasis: PensionsEarningsBasis,
    taxTreatment: PensionTaxTreatment,
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): IPensionContributionCalculator {
    const basicRateOfTax =
      taxTreatment === PensionTaxTreatment.ReliefAtSource
        ? this.provider.getBasicRateOfTaxForTaxRelief(
            taxYear,
            payFrequency,
            taxPeriod,
          )
        : undefined;

    switch (earningsBasis) {
      case PensionsEarningsBasis.QualifyingEarnings:
        const { lowerLimit, upperLimit } =
          this.provider.getThresholdsForQualifyingEarnings(
            taxYear,
            payFrequency,
            taxPeriod,
          );
        return new QualifyingEarningsContributionsCalculator(
          taxTreatment,
          lowerLimit,
          upperLimit,
          basicRateOfTax,
        );

      case PensionsEarningsBasis.PensionablePaySet1:
      case PensionsEarningsBasis.PensionablePaySet2:
      case PensionsEarningsBasis.PensionablePaySet3:
        return new PensionablePaySetCalculator(
          earningsBasis,
          taxTreatment,
          basicRateOfTax,
        );

      default:
        throw new Error(
          `Unrecognized value for earnings basis '${earningsBasis}'`,
        );
    }
  }
}
