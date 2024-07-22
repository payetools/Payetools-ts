// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IHmrcReferenceDataProvider } from "~/Payetools.ReferenceData/IHmrcReferenceDataProvider";
import { CalculatorFactoryDataFixture } from "../Payetools.Testing.Utils/CalculatorFactoryDataFixture";
import { IPensionContributionCalculatorFactory } from "~/Payetools.Pensions/IPensionContributionCalculatorFactory";
import { PensionContributionCalculatorFactory } from "~/Payetools.Pensions/PensionContributionCalculatorFactory";
/**
 * @vitest
 */
export class PensionContributionsCalculatorFactoryDataFixture extends CalculatorFactoryDataFixture<IPensionContributionCalculatorFactory> {
  protected override makeFactory(
    provider: IHmrcReferenceDataProvider,
  ): IPensionContributionCalculatorFactory {
    return new PensionContributionCalculatorFactory(provider);
  }
}
