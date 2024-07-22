// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { INiCalculator } from "./INiCalculator";

/**
 * Interface that represents factories that can generate INiCalculator implementations.
 */
export interface INiCalculatorFactory {
  /**
   * Gets an instance of an INiCalculator for the specified pay date.
   *
   * @param payDate - Applicable pay date.
   * @param numberOfTaxPeriods - Number of tax periods applicable, usually 1. Defaults to 1.
   * @param applyWeek53Treatment - Flag that indicates whether to apply "week 53" treatment, i.e., where
   * there are 53 weeks in a tax year (or 27 periods in a two-weekly pay cycle, etc.). Must be false
   * for monthly, quarterly and annual payrolls. Optional, defaulting to false.
   * @returns Instance of INiCalculator for the specified tax regime and pay date.
   */
  getCalculator(
    payDate: PayDate,
    numberOfTaxPeriods?: number,
    applyWeek53Treatment?: boolean,
  ): INiCalculator;
}
