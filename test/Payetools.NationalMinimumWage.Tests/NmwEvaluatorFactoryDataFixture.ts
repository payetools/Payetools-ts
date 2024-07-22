// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { INmwEvaluatorFactory } from "~/Payetools.NationalMinimumWage/INmwEvaluatorFactory";
import { NmwEvaluatorFactory } from "~/Payetools.NationalMinimumWage/NmwEvaluatorFactory";
import { CalculatorFactoryDataFixture } from "../Payetools.Testing.Utils/CalculatorFactoryDataFixture";
import { IHmrcReferenceDataProvider } from "~/Payetools.ReferenceData/IHmrcReferenceDataProvider";

/**
 * NmwEvaluatorFactoryDataFixture class
 */
export class NmwEvaluatorFactoryDataFixture extends CalculatorFactoryDataFixture<INmwEvaluatorFactory> {
  /**
   * Creates an instance of INmwEvaluatorFactory
   * @param provider - The reference data provider
   * @returns An instance of INmwEvaluatorFactory
   */
  protected makeFactory(
    provider: IHmrcReferenceDataProvider,
  ): INmwEvaluatorFactory {
    return new NmwEvaluatorFactory(provider);
  }
}
