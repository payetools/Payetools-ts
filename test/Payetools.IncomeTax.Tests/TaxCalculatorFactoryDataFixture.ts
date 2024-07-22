// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IHmrcReferenceDataProvider } from "~/Payetools.ReferenceData/IHmrcReferenceDataProvider";
import { CalculatorFactoryDataFixture } from "../Payetools.Testing.Utils/CalculatorFactoryDataFixture";
import { ITaxCalculatorFactory } from "~/Payetools.IncomeTax/ITaxCalculatorFactory";
import { TaxCalculatorFactory } from "~/Payetools.IncomeTax/TaxCalculatorFactory";

/**
 * Data fixture for the TaxCalculatorFactory.
 * @implements {CalculatorFactoryDataFixture<ITaxCalculatorFactory>}
 */
export class TaxCalculatorFactoryDataFixture extends CalculatorFactoryDataFixture<ITaxCalculatorFactory> {
  /**
   * Creates a new instance of the TaxCalculatorFactory.
   * @param {IHmrcReferenceDataProvider} provider - The HMRC reference data provider.
   * @returns {ITaxCalculatorFactory} The new instance of the TaxCalculatorFactory.
   */
  protected override makeFactory(
    provider: IHmrcReferenceDataProvider,
  ): ITaxCalculatorFactory {
    return new TaxCalculatorFactory(provider);
  }
}
