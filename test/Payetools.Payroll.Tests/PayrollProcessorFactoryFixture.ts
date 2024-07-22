// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IHmrcReferenceDataProvider } from "~/Payetools.ReferenceData/IHmrcReferenceDataProvider";
import { CalculatorFactoryDataFixture } from "../Payetools.Testing.Utils/CalculatorFactoryDataFixture";
import { IPayRunProcessorFactory } from "~/Payetools.Payroll/PayRuns/IPayRunProcessorFactory";
import { PayRunProcessorFactory } from "~/Payetools.Payroll/PayRuns/PayRunProcessorFactory";

export class PayrollProcessorFactoryFixture extends CalculatorFactoryDataFixture<IPayRunProcessorFactory> {
  protected makeFactory(
    provider: IHmrcReferenceDataProvider,
  ): IPayRunProcessorFactory {
    return new PayRunProcessorFactory(provider);
  }
}
