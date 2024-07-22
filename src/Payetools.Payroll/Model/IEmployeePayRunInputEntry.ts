// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IPensionContributionLevels } from "~/Payetools.Pensions/Model/IPensionContributionLevels";
import { IDeductionEntry } from "./IDeductionEntry";
import { IEarningsEntry } from "./IEarningsEntry";
import { IEmployment } from "./IEmployment";
import { IPayrolledBenefitForPeriod } from "./IPayrolledBenefitForPeriod";

/**
 * Represents an employee payrun entry, i.e., all the information needed to prepare the payroll
 * record for the employee for the pay period in question.
 */
export interface IEmployeePayRunInputEntry {
  /**
   * Gets the employment details for the employee for this entry.  (Use the EmployeeId of the Employment to
   * get access to the employee and related data.)
   */
  employment: IEmployment;

  /**
   * Gets the list of deductions for this employee for a given payrun.  May be empty.
   */
  deductions: IDeductionEntry[];

  /**
   * Gets the list of pay components for this employee for a given payrun.  May be empty but usually not.
   */
  earnings: IEarningsEntry[];

  /**
   * Gets the list of payrolled benefits for this employee for a given payrun.  Empty if the employee has
   * no payrolled benefits.
   */
  payrolledBenefits: IPayrolledBenefitForPeriod[];

  /**
   * Gets the pension contributions to apply for this pay period.. Null if no pension payments are being made.
   */
  pensionContributionLevels?: IPensionContributionLevels;

  /**
   * Gets a value indicating whether this employee is being recorded as left employment in this pay run.
   * Note that the employee's leaving date may be before the start of the pay period for this pay run.
   */
  isLeaverInThisPayRun: boolean;

  /**
   * Gets a value indicating whether an ex-employee is being paid after the leaving date has been reported to
   * HMRC in a previous submission.
   */
  isPaymentAfterLeaving: boolean;
}
