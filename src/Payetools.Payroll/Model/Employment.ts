// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { NormalHoursWorkedBand } from "~/Payetools.Common/Model/NormalHoursWorkedBand";
import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { DirectorsNiCalculationMethod } from "~/Payetools.NationalInsurance/Model/DirectorsNiCalculationMethod";
import { IPensionContributionLevels } from "~/Payetools.Pensions/Model/IPensionContributionLevels";
import { IPensionScheme } from "~/Payetools.Pensions/Model/IPensionScheme";
import { EmployeePayrollHistoryYtd } from "./EmployeePayrollHistoryYtd";
import { IEmployeePayRunInputEntry } from "./IEmployeePayRunInputEntry";
import { IEmployeePayRunResult } from "./IEmployeePayRunResult";
import { IEmployeePayStructure } from "./IEmployeePayStructure";
import { IEmployeePayrollHistoryYtd } from "./IEmployeePayrollHistoryYtd";
import { IEmployment } from "./IEmployment";
import { IPayrolledBenefit } from "./IPayrolledBenefit";
import { IRecurringDeduction } from "./IRecurringDeduction";
import { IRecurringEarnings } from "./IRecurringEarnings";
import { StudentLoanInfo } from "./StudentLoanInfo";
import { CalendarDate } from "calendar-date";
import { EarningsHistoryYtd } from "./EarningsHistoryYtd";
import { DeductionsHistoryYtd } from "./DeductionsHistoryYtd";

/**
 * Represents an employee's employment for payroll purposes.
 */
export class Employment implements IEmployment {
  private _payrollHistoryYtd: IEmployeePayrollHistoryYtd =
    new EmployeePayrollHistoryYtd();

  /**
   * Gets the employee's official employment start date.
   */
  public employmentStartDate: CalendarDate = CalendarDate.nowUTC();

  /**
   * Gets the employee's official employment termination date, i.e., their last working
   * day.  Null if the employee is still employed.
   */
  public employmentEndDate?: CalendarDate;

  /**
   * Gets the employee's tax code.
   */
  public taxCode: TaxCode = TaxCode.tryParse("1257L")!;

  /**
   * Gets the normal hours worked by the employee in one of several bands established by HMRC.
   */
  public normalHoursWorkedBand: NormalHoursWorkedBand = NormalHoursWorkedBand.A;

  /**
   * Gets the employee's NI category.
   */
  public niCategory: NiCategory = NiCategory.Unspecified;

  /**
   * Gets the employee's payroll ID, as reported to HMRC.  Sometimes known as "works number".
   */
  public payrollId: PayrollId = {} as PayrollId;

  /**
   * Gets a value indicating whether the employee is a company director.
   */
  public isDirector: boolean = false;

  /**
   * Gets the method for calculating National Insurance contributions.  Applicable only
   * for directors; null otherwise.
   */
  public directorsNiCalculationMethod?: DirectorsNiCalculationMethod;

  /**
   * Gets the date the employee was appointed as a director, where appropriate; null otherwise.
   */
  public directorsAppointmentDate?: CalendarDate;

  /**
   * Gets the date the employee ceased to be a director, where appropriate; null otherwise.
   */
  public ceasedToBeDirectorDate?: CalendarDate;

  /**
   * Gets the employee's current student loan status.
   */
  public studentLoanInfo?: StudentLoanInfo;

  /**
   * Gets the employee's primary pay structure.
   */
  public primaryPayStructure: IEmployeePayStructure =
    {} as IEmployeePayStructure;

  /**
   * Gets the pension scheme that the employee is a member of.  Null if they are not a member of
   * any scheme.
   */
  public pensionScheme?: IPensionScheme | null;

  /**
   * Gets the default pension contributions to apply in each pay period, unless overridden by employee
   * or employer instruction for that pay period.
   */
  public defaultPensionContributionLevels: IPensionContributionLevels =
    {} as IPensionContributionLevels;

  /**
   * Gets a value indicating whether the employee is paid on an irregular basis.
   */
  public isIrregularlyPaid: boolean = false;

  /**
   * Gets a value indicating whether the employee is an off-payroll worker.
   */
  public isOffPayrollWorker: boolean = false;

  /**
   * Gets the list of payrolled benefits that apply to this employment.
   */
  public payrolledBenefits: IPayrolledBenefit[] = [];

  /**
   * Gets the list of recurring earnings elements for an employee.
   */
  public recurringEarnings: IRecurringEarnings[] = [];

  /**
   * Gets the list of recurring deductions for an employee.
   */
  public recurringDeductions: IRecurringDeduction[] = [];

  /**
   * Gets the key figures from the employee's payroll history for the tax year to date.
   */
  public get payrollHistoryYtd(): IEmployeePayrollHistoryYtd {
    return this._payrollHistoryYtd;
  }

  /**
   * Updates the payroll history for this employee with the supplied pay run information.
   * @param payRunInput Employee pay run input entry.
   * @param payrunResult Results of a set of payroll calculations for the employee.
   */
  public updatePayrollHistory(
    payRunInput: IEmployeePayRunInputEntry,
    payrunResult: IEmployeePayRunResult,
  ): void {
    this._payrollHistoryYtd = this._payrollHistoryYtd.add(
      payRunInput,
      payrunResult,
    );
  }
}
