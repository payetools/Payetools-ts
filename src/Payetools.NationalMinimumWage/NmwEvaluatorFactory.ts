// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { INmwEvaluator } from "./INmwEvaluator";
import { INmwEvaluatorFactory } from "./INmwEvaluatorFactory";
import { NmwEvaluator } from "./NmwEvaluator";
import { INmwReferenceDataProvider } from "./ReferenceData/INmwReferenceDataProvider";

/**
 * Factory to generate INmwEvaluator implementations that are for a given pay date.
 */
export class NmwEvaluatorFactory implements INmwEvaluatorFactory {
  private provider: INmwReferenceDataProvider;

  /**
   * Initialises a new instance of NmwEvaluatorFactory with the supplied INmwReferenceDataProvider.
   * @param provider Reference data provider used to seed new NMW/NLW evaluators.
   */
  constructor(provider: INmwReferenceDataProvider) {
    this.provider = provider;
  }

  /**
   * Gets a new INmwEvaluator based on the specified pay date. The pay date is provided in order to determine
   * which set of level to use, noting that these may (but rarely do) change in-year.
   * @param payDate Applicable pay date.
   * @returns A new evaluator instance.
   */
  getEvaluator(payDate: PayDate): INmwEvaluator {
    return this.getEvaluatorWithOptions(
      payDate.taxYear,
      payDate.payFrequency,
      payDate.taxPeriod,
    );
  }

  /**
   * Gets a new INmwEvaluator based on the specified tax year, pay frequency and pay period, along with the
   * applicable number of tax periods. The tax year, pay frequency and pay period are provided in order to determine which
   * set of thresholds and rates to use, noting that these may change in-year.
   * @param taxYear Applicable tax year.
   * @param payFrequency Applicable pay frequency.
   * @param taxPeriod Applicable tax period.
   * @returns A new evaluator instance.
   */
  getEvaluatorWithOptions(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): INmwEvaluator {
    return new NmwEvaluator(
      this.provider.getNmwLevelsForTaxYearAndPeriod(
        taxYear,
        payFrequency,
        taxPeriod,
      ),
    );
  }
}
