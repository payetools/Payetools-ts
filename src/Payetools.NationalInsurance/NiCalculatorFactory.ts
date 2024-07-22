// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { INiCalculator } from "./INiCalculator";
import { INiCalculatorFactory } from "./INiCalculatorFactory";
import { INiReferenceDataProvider } from "./ReferenceData/INiReferenceDataProvider";
import { NiPeriodThresholdSet } from "./ReferenceData/NiPeriodThresholdSet";
import { PayFrequencyExtensions } from "~/Payetools.Common/Model/PayFrequency";
import { NiCalculator } from "./NiCalculator";

/**
 * Factory to generate INiCalculatorFactory implementations that are for a given pay date.
 */
export class NiCalculatorFactory implements INiCalculatorFactory {
  private niReferenceDataProvider: INiReferenceDataProvider;

  /**
   * Initialises a new instance of NiCalculatorFactory with the supplied INiReferenceDataProvider.
   * @param niReferenceDataProvider Reference data provider used to seed new NI calculators.
   */
  constructor(niReferenceDataProvider: INiReferenceDataProvider) {
    this.niReferenceDataProvider = niReferenceDataProvider;
  }

  /**
   * Gets a new INiCalculator based on the specified pay date and number of tax periods. The pay date
   * is provided in order to determine which set of thresholds and rates to use, noting that these may change in-year.
   * @param payDate Applicable pay date.
   * @param numberOfTaxPeriods Number of tax periods applicable, usually 1. Defaults to 1.
   * @param applyWeek53Treatment Flag that indicates whether to apply "week 53" treatment, i.e., where
   * there are 53 weeks in a tax year (or 27 periods in a two-weekly pay cycle, etc.). Must be false
   * for monthly, quarterly and annual payrolls. Optional, defaulting to false.
   * @returns A new calculator instance.
   */
  getCalculator(
    payDate: PayDate,
    numberOfTaxPeriods: number = 1,
    applyWeek53Treatment: boolean = false,
  ): INiCalculator {
    const annualThresholds =
      this.niReferenceDataProvider.getNiThresholdsForPayDate(payDate);
    const periodThresholds = new NiPeriodThresholdSet(
      annualThresholds,
      payDate.payFrequency,
      numberOfTaxPeriods,
    );
    const rates = this.niReferenceDataProvider.getNiRatesForPayDate(payDate);
    const directorsRates =
      this.niReferenceDataProvider.getDirectorsNiRatesForPayDate(payDate);

    return new NiCalculator(
      annualThresholds,
      periodThresholds,
      rates,
      directorsRates,
      PayFrequencyExtensions.isLastTaxPeriodInTaxYear(
        payDate.payFrequency,
        payDate.taxPeriod,
        applyWeek53Treatment,
      ),
    );
  }
}
