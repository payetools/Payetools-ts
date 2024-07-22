// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IPensionContributionLevels } from "~/Payetools.Pensions/Model/IPensionContributionLevels";
import { IDeductionEntry } from "./IDeductionEntry";
import { IEarningsEntry } from "./IEarningsEntry";
import { IEmployeePayRunInputEntry } from "./IEmployeePayRunInputEntry";
import { IEmployment } from "./IEmployment";
import { IPayrolledBenefitForPeriod } from "./IPayrolledBenefitForPeriod";

/**
 * Represents an employee payrun entry, i.e., all the information needed to prepare the payroll
 * record for the employee for the pay period in question.
 */
export class EmployeePayRunInputEntry implements IEmployeePayRunInputEntry {
  /**
   * Gets the employment details for the employee for this entry.  (Use the PayrollId of this field as a
   * handle to get access to the employee and related data.)
   */
  public employment: IEmployment;

  /**
   * Gets the list of deductions for this employee for a given payrun.  May be empty.
   */
  public deductions: IDeductionEntry[];

  /**
   * Gets the list of pay components for this employee for a given payrun.  May be empty but usually not.
   */
  public earnings: IEarningsEntry[];

  /**
   * Gets the list of payrolled benefits for this employee for a given payrun.  Empty if the employee has
   * no payrolled benefits.
   */
  public payrolledBenefits: IPayrolledBenefitForPeriod[];

  /**
   * Gets the pension contributions to apply for this pay period. Null if no pension payments are being made.
   */
  public pensionContributionLevels?: IPensionContributionLevels;

  /**
   * Gets a value indicating whether this employee is being recorded as left employment in this pay run.
   * Note that the employee's leaving date may be before the start of the pay period for this pay run.
   */
  public isLeaverInThisPayRun: boolean;

  /**
   * Gets a value indicating whether an ex-employee is being paid after the leaving date has been reported to
   * HMRC in a previous submission.
   */
  public isPaymentAfterLeaving: boolean;

  /**
   * Initialises a new instance of EmployeePayRunInputEntry.
   * @param employment Employment details.
   * @param earnings List of applicable earnings, if any.  Empty list if none.
   * @param deductions List of applicable deductions, if any.  Empty list if none.
   * @param payrolledBenefits List of payrolled benefits, if any.  Empty list if none.
   * @param pensionContributionLevels Pension contribution levels to be applied.
   * @param isLeaverInThisPayRun Should be set to true if the employee needs to be
   * reported as leaving during this pay run. Defaults to false.
   * @param isPaymentAfterLeaving Should be set to true if the employee has already been
   * reported as left but a further payment is being made to them. Defaults to false.
   */
  constructor(
    employment: IEmployment,
    earnings: IEarningsEntry[],
    deductions: IDeductionEntry[],
    payrolledBenefits: IPayrolledBenefitForPeriod[],
    pensionContributionLevels?: IPensionContributionLevels,
    isLeaverInThisPayRun: boolean = false,
    isPaymentAfterLeaving: boolean = false,
  ) {
    this.employment = employment;
    this.earnings = earnings;
    this.deductions = deductions;
    this.payrolledBenefits = payrolledBenefits;
    this.pensionContributionLevels = pensionContributionLevels;
    this.isLeaverInThisPayRun = isLeaverInThisPayRun;
    this.isPaymentAfterLeaving = isPaymentAfterLeaving;
  }
}
