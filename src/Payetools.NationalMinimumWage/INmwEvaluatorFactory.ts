// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { INmwEvaluator } from "./INmwEvaluator";

/**
 * Interface that represents factories that can generate INmwEvaluator implementations.
 */
export interface INmwEvaluatorFactory {
  /**
   * Gets a new INmwEvaluator based on the specified pay date and number of tax periods. The pay date
   * is provided in order to determine which set of levels to use, noting that these may (but rarely do) change in-year.
   *
   * @param payDate - Applicable pay date.
   * @returns A new evaluator instance.
   */
  getEvaluator(payDate: PayDate): INmwEvaluator;

  /**
   * Gets a new INmwEvaluator based on the specified tax year, pay frequency and pay period. The tax
   * year, pay frequency and pay period are provided in order to determine which set of levels to use, noting that
   * these may (but rarely do) change in-year.
   *
   * @param taxYear - Applicable tax year.
   * @param payFrequency - Applicable pay frequency.
   * @param taxPeriod - Applicable tax period.
   * @returns A new evaluator instance.
   */
  getEvaluatorWithOptions(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): INmwEvaluator;
}
