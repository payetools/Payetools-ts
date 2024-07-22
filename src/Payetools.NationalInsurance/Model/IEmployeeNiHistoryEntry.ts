// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { INiCalculationResult } from "./INiCalculationResult";
import { Money } from "@dintero/money";

/**
 * Interface that represents once element of the employee's NI history during the current tax year. For employees that have
 * only have one NI category throughout the tax year, they will have just one instance of `EmployeeNiHistoryEntry`
 * applicable. But it is of course possible for an employee's NI category to change throughout the tax year (for example
 * because they turned 21 years of age), and in this case, multiple records must be held.
 */
export interface IEmployeeNiHistoryEntry {
  /**
   * Gets the National Insurance category letter pertaining to this record.
   */
  niCategoryPertaining: NiCategory;

  /**
   * Gets the gross NI-able earnings applicable for the duration of this record.
   */
  grossNicableEarnings: Money;

  /**
   * Gets the total employee contribution made during the duration of this record.
   */
  employeeContribution: Money;

  /**
   * Gets the total employer contribution made during the duration of this record.
   */
  employerContribution: Money;

  /**
   * Gets the total contribution (employee + employer) made during the duration of this record.
   */
  totalContribution: Money;

  /**
   * Gets the earnings at the Lower Earnings Limit for this record. (Earnings below the LEL are
   * ignored for historical purposes).
   */
  earningsAtLEL: Money;

  /**
   * Gets the earnings up above the Lower Earnings Limit and up to and including the Secondary Threshold
   * for this record.
   */
  earningsAboveLELUpToAndIncludingST: Money;

  /**
   * Gets the earnings up above the Secondary Threshold and up to and including the Primary Threshold
   * for this record.
   */
  earningsAboveSTUpToAndIncludingPT: Money;

  /**
   * Gets the earnings up above the Primary Threshold and up to and including the Freeport Upper Secondary
   * Threshold for this record.
   */
  earningsAbovePTUpToAndIncludingFUST: Money;

  /**
   * Gets the earnings up above the Freeport Upper Secondary Threshold and up to and including the Upper
   * Earnings Limit for this record.
   */
  earningsAboveFUSTUpToAndIncludingUEL: Money;

  /**
   * Gets the earnings up above the Upper Earnings Limit for this record.
   */
  earningsAboveUEL: Money;

  /**
   * Gets the earnings up above the Secondary Threshold and up to and including the Upper Earnings Limit
   * for this record.
   */
  earningsAboveSTUpToAndIncludingUEL: Money;

  /**
   * Adds the results of an NI calculation to the current history and returns a new instance of `IEmployeeNiHistoryEntry`
   * with the results applied.
   * @param result NI calculation results to add to this history entry.
   * @returns New instance of `IEmployeeNiHistoryEntry` with the NI calculation result applied.
   */
  add(result: INiCalculationResult): IEmployeeNiHistoryEntry;
}
