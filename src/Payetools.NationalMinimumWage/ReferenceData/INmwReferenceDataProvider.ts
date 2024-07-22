// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { INmwLevelSet } from "./INmwLevelSet";

/**
 * Interface that classes implement in order to provide access to National Minimum/Living Wage reference data.
 */
export interface INmwReferenceDataProvider {
  /**
   * Gets the NMW/NLW levels for the specified tax year and tax period, as denoted by the supplied pay frequency
   * and pay period.
   *
   * @param taxYear - Applicable tax year.
   * @param payFrequency - Applicable pay frequency.
   * @param taxPeriod - Applicable tax period.
   * @returns An instance of INmwLevelSet containing the levels for the specified point in time.
   */
  getNmwLevelsForTaxYearAndPeriod(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): INmwLevelSet;
}
