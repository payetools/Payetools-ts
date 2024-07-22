// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { InvalidReferenceDataException } from "~/Payetools.Common/Diagnostics/InvalidReferenceDataException";
import { CountriesForTaxPurposes } from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { ITaxCalculator } from "./ITaxCalculator";
import { ITaxReferenceDataProvider } from "./ReferenceData/ITaxReferenceDataProvider";
import { TaxCalculator } from "./TaxCalculator";
import { ITaxCalculatorFactory } from "./ITaxCalculatorFactory";

/**
 * Factory to generate ITaxCalculator implementations that are for a given pay date and specific tax regime.
 */
export class TaxCalculatorFactory implements ITaxCalculatorFactory {
  private readonly taxBandProvider: ITaxReferenceDataProvider;

  /**
   * Initialises a new instance of TaxCalculatorFactory using the supplied tax band provider.
   * @param taxBandProvider - Tax band provider for providing access to tax bands for given tax years.
   */
  constructor(taxBandProvider: ITaxReferenceDataProvider) {
    this.taxBandProvider = taxBandProvider;
  }

  /**
   * Gets an instance of an ITaxCalculator for the specified tax regime and pay date.
   * @param applicableCountries - Applicable tax regime.
   * @param payDate - Pay date.
   * @returns Instance of ITaxCalculator for the specified tax regime and pay date.
   * @throws InvalidReferenceDataException - Thrown if it was not possible to find a tax bandwidth set for the specified
   * tax regime and tax year combination.
   */
  public getCalculator(
    applicableCountries: CountriesForTaxPurposes,
    payDate: PayDate,
  ): ITaxCalculator {
    return this.getCalculatorForTaxPeriod(
      applicableCountries,
      payDate.taxYear,
      payDate.payFrequency,
      payDate.taxPeriod,
    );
  }

  /**
   * Gets an instance of an ITaxCalculator for the specified tax regime, tax year, tax period and pay frequency.
   * @param applicableCountries - Applicable tax regime.
   * @param taxYear - Relevant tax year.
   * @param payFrequency - Applicable pay frequency.
   * @param taxPeriod - Applicable tax period.
   * @returns Instance of ITaxCalculator for the specified tax regime, tax year and period and pay frequency.
   * @throws InvalidReferenceDataException - Thrown if it was not possible to find a tax bandwidth set for the specified
   * tax regime and tax year combination.
   */
  public getCalculatorForTaxPeriod(
    applicableCountries: CountriesForTaxPurposes,
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): ITaxCalculator {
    const taxBandwidthSets =
      this.taxBandProvider.getTaxBandsForTaxYearAndPeriod(
        taxYear,
        payFrequency,
        taxPeriod,
      );

    const taxBandwidthSet = taxBandwidthSets.get(applicableCountries);
    if (!taxBandwidthSet) {
      throw new InvalidReferenceDataException(
        `Unable to find unique tax bands for countries/tax year combination [${applicableCountries}] ${taxYear}`,
      );
    }

    return new TaxCalculator(
      taxYear,
      applicableCountries,
      taxBandwidthSet,
      payFrequency,
      taxPeriod,
    );
  }
}
