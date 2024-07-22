// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IEmployeePayRunResult } from "./IEmployeePayRunResult";
import { IEmployer } from "./IEmployer";
import { IPayRunDetails } from "./IPayRunDetails";
import { IPayRunSummary } from "./IPayRunSummary";

// Interface that represents the output of a given pay run.
export interface IPayRunResult {
  /**
   * Gets the employer that this pay run result pertains to.
   */
  employer: IEmployer;

  /**
   * Gets the pay date and pay period for this pay run.
   */
  payRunDetails: IPayRunDetails;

  /**
   * Gets the list of employee pay run entries.
   */
  employeePayRunResults: IEmployeePayRunResult[];

  /**
   * Gets a summary of this pay run, providing totals for all statutory payments.
   * @param payRunSummary - instance that provides summary figures.
   */
  getPayRunSummary(payRunSummary: IPayRunSummary): void;
}
