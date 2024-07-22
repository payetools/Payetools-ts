// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiYtdHistory } from "~/Payetools.NationalInsurance/Model/NiYtdHistory";
import { IDeductionsHistoryYtd } from "./IDeductionsHistoryYtd";
import { IEarningsHistoryYtd } from "./IEarningsHistoryYtd";
import { IEmployeePayRunResult } from "./IEmployeePayRunResult";
import { Money } from "@dintero/money";
import { IEmployeePayRunInputEntry } from "./IEmployeePayRunInputEntry";

/**
 * Interface for types that represent the historical set of information for an employee's payroll for the
 * current tax year.
 */
export interface IEmployeePayrollHistoryYtd {
  /**
   * Gets any statutory maternity pay paid to date this tax year.
   */
  statutoryMaternityPayYtd: Money;

  /**
   * Gets any statutory paternity pay paid to date this tax year.
   */
  statutoryPaternityPayYtd: Money;

  /**
   * Gets any statutory adoption pay paid to date this tax year.
   */
  statutoryAdoptionPayYtd: Money;

  /**
   * Gets any statutory parental pay paid to date this tax year.
   */
  statutorySharedParentalPayYtd: Money;

  /**
   * Gets any statutory parental bereavement pay paid to date this tax year.
   */
  statutoryParentalBereavementPayYtd: Money;

  /**
   * Gets any statutory sickness pay paid to date this tax year.
   */
  statutorySickPayYtd: Money;

  /**
   * Gets the National Insurance payment history for the current tax year. Employees may
   * transition between NI categories during the tax year and each NI category's payment
   * record must be retained.
   */
  employeeNiHistoryEntries: NiYtdHistory;

  /**
   * Gets the gross pay paid to date this tax year.
   */
  grossPayYtd: Money;

  /**
   * Gets the taxable pay paid to date this tax year.
   */
  taxablePayYtd: Money;

  /**
   * Gets the NI-able pay paid to date this tax year.
   */
  nicablePayYtd: Money;

  /**
   * Gets the income tax paid to date this tax year.
   */
  taxPaidYtd: Money;

  /**
   * Gets the student loan deductions made to date this tax year.
   */
  studentLoanRepaymentsYtd: Money;

  /**
   * Gets the postgraduate loan deductions made to date this tax year.
   */
  postgraduateLoanRepaymentsYtd: Money;

  /**
   * Gets the amount accrued against payrolled benefits to date this tax year.
   */
  payrolledBenefitsYtd: Money;

  /**
   * Gets the total employee pension contributions made under a net pay arrangement to date this tax year.
   */
  employeePensionContributionsUnderNpaYtd: Money;

  /**
   * Gets the total employee pension contributions made under relief at source to date this tax year.
   */
  employeePensionContributionsUnderRasYtd: Money;

  /**
   * Gets the total employer pension contributions made to date this tax year.
   */
  employerPensionContributionsYtd: Money;

  /**
   * Gets the tax that it has not been possible to collect so far this tax year due to the
   * regulatory limit on income tax deductions.
   */
  taxUnpaidDueToRegulatoryLimit: Money;

  /**
   * Gets the employee's earnings history for the tax year to date.
   */
  earningsHistoryYtd: IEarningsHistoryYtd;

  /**
   * Gets the employee's deduction history for the tax year to date.
   */
  deductionsHistoryYtd: IDeductionsHistoryYtd;

  /**
   * Adds the results of the pay run provided to the current instance and returns a new instance of
   * IEmployeePayrollHistoryYtd.
   * @param payrunResult Results of a set of payroll calculations for a given employee.
   * @returns New instance of IEmployeePayrollHistoryYtd with the calculation results applied.
   */
  add(
    payRunInput: IEmployeePayRunInputEntry,
    payrunResult: IEmployeePayRunResult,
  ): IEmployeePayrollHistoryYtd;
}
