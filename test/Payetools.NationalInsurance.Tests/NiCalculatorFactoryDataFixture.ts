// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IHmrcReferenceDataProvider } from "~/Payetools.ReferenceData/IHmrcReferenceDataProvider";
import { CalculatorFactoryDataFixture } from "../Payetools.Testing.Utils/CalculatorFactoryDataFixture";
import { INiCalculatorFactory } from "~/Payetools.NationalInsurance/INiCalculatorFactory";
import { NiCalculatorFactory } from "~/Payetools.NationalInsurance/NiCalculatorFactory";

/**
 * @class NiCalculatorFactoryDataFixture
 * @extends CalculatorFactoryDataFixture<INiCalculatorFactory>
 */
export class NiCalculatorFactoryDataFixture extends CalculatorFactoryDataFixture<INiCalculatorFactory> {
  /**
   * @param {IHmrcReferenceDataProvider} provider
   * @returns {INiCalculatorFactory}
   */
  protected override makeFactory(
    provider: IHmrcReferenceDataProvider,
  ): INiCalculatorFactory {
    return new NiCalculatorFactory(provider);
  }
}
