// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { INiCategoryRatesEntry } from "./INiCategoryRatesEntry";
import { INiThresholdSet } from "./INiThresholdSet";

/**
 * Interface that classes implement in order to provide access to National Insurance reference data, i.e.,
 * rates and thresholds.
 */
export interface INiReferenceDataProvider {
  /**
   * Gets the NI thresholds for the specified pay date.
   * @param payDate - Applicable pay date.
   * @returns An instance of INiThresholdSet containing the thresholds for the specified point
   * in time.
   */
  getNiThresholdsForPayDate(payDate: PayDate): INiThresholdSet;

  /**
   * Gets a read-only dictionary that maps NiCategory values to the set of rates to be applied
   * for the specified pay date.
   * @param payDate - Applicable pay date.
   * @returns Read-only dictionary that maps NiCategory values to the appropriate set of rates for
   * the specified point in time.
   */
  getNiRatesForPayDate(
    payDate: PayDate,
  ): ReadonlyMap<NiCategory, INiCategoryRatesEntry>;

  /**
   * Gets a read-only dictionary that maps NiCategory values to the set of rates to be applied
   * for the specified pay date, for directors.  (For most tax years, this method returns null, but if
   * there have been in-year changes, specific directors' rates may apply.)
   * @param payDate - Applicable pay date.
   * @returns Read-only dictionary that maps NiCategory values to the appropriate set of rates for
   * the specified point in time.  If specific rates apply for directors, theses are returned, otherwise the
   * regular employee/employer rates are returned.
   */
  getDirectorsNiRatesForPayDate(
    payDate: PayDate,
  ): ReadonlyMap<NiCategory, INiCategoryRatesEntry>;
}
