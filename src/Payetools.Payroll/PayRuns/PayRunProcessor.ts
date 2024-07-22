// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IEmployeePayRunInputEntry } from "../Model/IEmployeePayRunInputEntry";
import { IEmployer } from "../Model/IEmployer";
import { IPayRunResult } from "../Model/IPayRunResult";
import { PayRunDetails } from "../Model/PayRunDetails";
import { PayRunResult } from "../Model/PayRunResult";
import { IPayRunEntryProcessor } from "./IPayRunEntryProcessor";
import { IPayRunProcessor } from "./IPayRunProcessor";

/**
 * Processor for processing a payrun for a specific pay reference period and pay date.
 */
export class PayRunProcessor implements IPayRunProcessor {
  private readonly payrunCalculator: IPayRunEntryProcessor;

  /**
   * Initialises a new instance of `PayRunProcessor` with the supplied calculator.
   * @param calculator - Calculator to be used to calculate earnings, deductions and net pay.
   */
  constructor(calculator: IPayRunEntryProcessor) {
    this.payrunCalculator = calculator;
  }

  /**
   * Processes this pay run.
   * @param employer - Employer that this processing relates to.
   * @param employeePayRunEntries - Pay run information for each employee in the payrun.
   * @param result - An instance of a class that implements `IPayRunResult` containing the results of this payrun.
   */
  process(
    employer: IEmployer,
    employeePayRunEntries: IEmployeePayRunInputEntry[],
  ): IPayRunResult {
    return new PayRunResult(
      employer,
      new PayRunDetails(
        this.payrunCalculator.payDate,
        this.payrunCalculator.payPeriod,
      ),
      employeePayRunEntries,
      employeePayRunEntries.map((entry) =>
        this.payrunCalculator.process(entry),
      ),
    );
  }
}
