// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { IEmployeePayRunInputEntry } from "~/Payetools.Payroll/Model/IEmployeePayRunInputEntry";
import { IEmployeePayRunResult } from "~/Payetools.Payroll/Model/IEmployeePayRunResult";

/**
 * Interface that represents types that can process an employee's set of input payroll data and
 * provide the results of the calculations in the form of an IEmployeePayRunResult.
 */
export interface IPayRunEntryProcessor {
  /**
   * Gets the pay date for this payrun calculator.
   */
  payDate: PayDate;

  /**
   * Gets the pay period for this payrun calculator.
   */
  payPeriod: DateRange;

  /**
   * Processes the supplied payrun entry calculating all the earnings and deductions, income tax, national insurance and
   * other statutory deductions, and generating a result structure which includes the final net pay.
   *
   * @param entry - Instance of IEmployeePayRunInputEntry containing all the necessary input data for the
   * payroll calculation.
   * @param result - An instance of IEmployeePayRunResult containing the results of the payroll calculations.
   */
  process(entry: IEmployeePayRunInputEntry): IEmployeePayRunResult;
}
