// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { IStudentLoanCalculator } from "./IStudentLoanCalculator";

/**
 * Interface that represents factories that can generate IStudentLoanCalculator implementations.
 */
export interface IStudentLoanCalculatorFactory {
  /**
   * Gets a new IStudentLoanCalculator based on the specified pay date and number of tax periods. The pay date
   * is provided in order to determine which set of levels to use, noting that these may (but rarely do) change in-year.
   *
   * @param payDate - Applicable pay date.
   * @returns A new calculator instance.
   * @remarks The supplied PayDate is also used to calculate the appropriate period threshold to apply, from the PayFrequency
   * property, e.g., weekly, monthly, etc.
   */
  getCalculator(payDate: PayDate): IStudentLoanCalculator;
}
