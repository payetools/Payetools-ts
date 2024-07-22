// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IEmployeePayRunInputEntry } from "../Model/IEmployeePayRunInputEntry";
import { IEmployer } from "../Model/IEmployer";
import { IPayRunResult } from "../Model/IPayRunResult";

/**
 * Interface that represents a payrun, i.e., the running of payroll for a single pay reference period
 * on a single pay date for a predefined set of employees within one employer's employment.
 */
export interface IPayRunProcessor {
  /**
   * Processes this payrun.
   *
   * @param employer - Employer that this processing relates to.
   * @param employeePayRunEntries - Payrun information for each employee in the payrun.
   * @param result - An instance of a class that implements IPayRunResult containing the results
   * of this payrun.
   */
  process(
    employer: IEmployer,
    employeePayRunEntries: IEmployeePayRunInputEntry[],
  ): IPayRunResult;
}
