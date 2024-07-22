// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { NormalHoursWorkedBand } from "~/Payetools.Common/Model/NormalHoursWorkedBand";
import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { DirectorsNiCalculationMethod } from "~/Payetools.NationalInsurance/Model/DirectorsNiCalculationMethod";
import { IPensionContributionLevels } from "~/Payetools.Pensions/Model/IPensionContributionLevels";
import { IPensionScheme } from "~/Payetools.Pensions/Model/IPensionScheme";
import { IEmployeePayRunInputEntry } from "./IEmployeePayRunInputEntry";
import { IEmployeePayRunResult } from "./IEmployeePayRunResult";
import { IEmployeePayStructure } from "./IEmployeePayStructure";
import { IEmployeePayrollHistoryYtd } from "./IEmployeePayrollHistoryYtd";
import { IPayrolledBenefit } from "./IPayrolledBenefit";
import { IRecurringDeduction } from "./IRecurringDeduction";
import { IRecurringEarnings } from "./IRecurringEarnings";
import { StudentLoanInfo } from "./StudentLoanInfo";

/**
 * Interface that represents an employee's employment for payroll purposes. The PayrollId provides a handle
 * to the employee that this employment refers to.
 */
export interface IEmployment {
  /**
   * Gets the employee's official employment start date.
   */
  employmentStartDate: CalendarDate;

  /**
   * Gets the employee's official employment termination date, i.e., their last working
   * day.  Null if the employee is still employed.
   */
  employmentEndDate?: CalendarDate;

  /**
   * Gets the employee's tax code.
   */
  taxCode: TaxCode;

  /**
   * Gets the normal hours worked by the employee in one of several bands established by HMRC.
   */
  normalHoursWorkedBand: NormalHoursWorkedBand;

  /**
   * Gets the employee's NI category.
   */
  niCategory: NiCategory;

  /**
   * Gets the employee's payroll ID, as reported to HMRC.  Sometimes known as "works number".
   */
  payrollId: PayrollId;

  /**
   * Gets a value indicating whether the employee is a company director.
   */
  isDirector: boolean;

  /**
   * Gets the method for calculating National Insurance contributions.  Applicable only
   * for directors; null otherwise.
   */
  directorsNiCalculationMethod?: DirectorsNiCalculationMethod | null;

  /**
   * Gets the date the employee was appointed as a director, where appropriate; null otherwise.
   */
  directorsAppointmentDate?: CalendarDate | null;

  /**
   * Gets the date the employee ceased to be a director, where appropriate; null otherwise.
   */
  ceasedToBeDirectorDate?: CalendarDate | null;

  /**
   * Gets the employee's current student loan status.
   */
  studentLoanInfo?: StudentLoanInfo | null;

  /**
   * Gets the employee's primary pay structure.
   */
  primaryPayStructure: IEmployeePayStructure;

  /**
   * Gets the pension scheme that the employee is a member of.  Null if they are not a member of
   * any scheme.
   */
  pensionScheme?: IPensionScheme | null;

  /**
   * Gets a value indicating whether the employee is paid on an irregular basis.
   */
  isIrregularlyPaid: boolean;

  /**
   * Gets a value indicating whether the employee is an off-payroll worker.
   */
  isOffPayrollWorker: boolean;

  /**
   * Gets the default pension contributions to apply in each pay period, unless overridden by employee
   * or employer instruction for that pay period.
   */
  defaultPensionContributionLevels: IPensionContributionLevels;

  /**
   * Gets the list of payrolled benefits that apply to this employment.
   */
  payrolledBenefits: IPayrolledBenefit[];

  /**
   * Gets the list of recurring earnings elements for an employee.
   */
  recurringEarnings: IRecurringEarnings[];

  /**
   * Gets the list of recurring deductions for an employee.
   */
  recurringDeductions: IRecurringDeduction[];

  /**
   * Gets the key figures from the employee's payroll history for the tax year to date.
   */
  payrollHistoryYtd: IEmployeePayrollHistoryYtd;

  /**
   * Updates the payroll history for this employee with the supplied pay run information.
   */
  updatePayrollHistory(
    payRunInput: IEmployeePayRunInputEntry,
    payrunResult: IEmployeePayRunResult,
  ): void;
}
