// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalculatorFactoryDataFixture } from "../Payetools.Testing.Utils/CalculatorFactoryDataFixture";
import { IStudentLoanCalculatorFactory } from "~/Payetools.StudentLoans/IStudentLoanCalculatorFactory";
import { StudentLoanCalculatorFactory } from "~/Payetools.StudentLoans/StudentLoanCalculatorFactory";
import { IHmrcReferenceDataProvider } from "~/Payetools.ReferenceData/IHmrcReferenceDataProvider";

/**
 * @class StudentLoanCalculatorFactoryDataFixture
 * @extends CalculatorFactoryDataFixture<IStudentLoanCalculatorFactory>
 */
export class StudentLoanCalculatorFactoryDataFixture extends CalculatorFactoryDataFixture<IStudentLoanCalculatorFactory> {
  /**
   * @param {HmrcReferenceDataProvider} provider
   * @returns {IStudentLoanCalculatorFactory}
   */
  protected makeFactory(
    provider: IHmrcReferenceDataProvider,
  ): IStudentLoanCalculatorFactory {
    return new StudentLoanCalculatorFactory(provider);
  }

  public constructor() {
    super();
  }
}
