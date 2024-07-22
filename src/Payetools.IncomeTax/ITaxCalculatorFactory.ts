// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CountriesForTaxPurposes } from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { ITaxCalculator } from "./ITaxCalculator";

/**
 * Interface that represents factories that can generate ITaxCalculator implementations.
 */
export interface ITaxCalculatorFactory {
  /**
   * Gets an instance of an ITaxCalculator for the specified tax regime and pay date.
   *
   * @param applicableCountries - Applicable tax regime.
   * @param payDate - Pay date.
   * @returns Instance of ITaxCalculator for the specified tax regime and pay date.
   */
  getCalculator(
    applicableCountries: CountriesForTaxPurposes,
    payDate: PayDate,
  ): ITaxCalculator;
}
