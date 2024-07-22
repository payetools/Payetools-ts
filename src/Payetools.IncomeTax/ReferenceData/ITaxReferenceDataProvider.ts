// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CountriesForTaxPurposes } from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { TaxBandwidthSet } from "./TaxBandwidthSet";

/**
 * Interface that represents a provider of tax band information.
 */
export interface ITaxReferenceDataProvider {
  /**
   * Retrieves the tax bands for a given tax year in the form of a dictionary
   * keyed on tax regime, i.e., CountriesForTaxPurposes.
   *
   * @param taxYear - Desired tax year.
   * @param payFrequency - Pay frequency pertaining. Used in conjunction with the taxPeriod parameter to
   * determine the applicable date (in case of in-year tax changes).
   * @param taxPeriod - Tax period, e.g., 1 for month 1. Currently ignored on the assumption that in-year
   * tax changes are not anticipated but provided for future.
   * @returns ReadonlyMap of TaxBandwidthSet's keyed on tax regime.
   * @remarks Although ReadonlyMap is not guaranteed to be thread-safe, in the current implementation the
   * underlying Map is guaranteed not to change, so thread-safety can be assumed.
   */
  getTaxBandsForTaxYearAndPeriod(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): ReadonlyMap<CountriesForTaxPurposes, TaxBandwidthSet>;
}
