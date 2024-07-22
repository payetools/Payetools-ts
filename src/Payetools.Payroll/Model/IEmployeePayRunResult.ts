// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ITaxCalculationResult } from "~/Payetools.IncomeTax/Model/ITaxCalculationResult";
import { INiCalculationResult } from "~/Payetools.NationalInsurance/Model/INiCalculationResult";
import { IAttachmentOfEarningsCalculationResult } from "~/Payetools.Statutory/AttachmentOfEarnings/IAttachmentOfEarningsCalculationResult";
import { IStudentLoanCalculationResult } from "~/Payetools.StudentLoans/Model/IStudentLoanCalculationResult";
import { IEmployment } from "./IEmployment";
import { IPensionContributionCalculationResult } from "~/Payetools.Pensions/Model/IPensionContributionCalculationResult";
import { IEmployeePayrollHistoryYtd } from "./IEmployeePayrollHistoryYtd";
import { Money } from "@dintero/money";

/**
 * Interface that represents a payrun result for an employee for a specific payrun.
 */
export interface IEmployeePayRunResult {
  /**
   * Gets the employee's employment details used in calculating this pay run result.  The PayrollId property of
   * this field can be used as a handle to get access to the employee.
   */
  employment: IEmployment;

  /**
   * Gets the results of this employee's income tax calculation for this payrun.
   */
  taxCalculationResult: ITaxCalculationResult;

  /**
   * Gets the results of this employee's National Insurance calculation for this payrun.
   */
  niCalculationResult: INiCalculationResult;

  /**
   * Gets the results of this employee's student loan calculation for this payrun, if applicable;
   * null otherwise.
   */
  studentLoanCalculationResult?: IStudentLoanCalculationResult;

  /**
   * Gets the results of this employee's pension calculation for this payrun, if applicable;
   * null otherwise.
   */
  pensionContributionCalculationResult?: IPensionContributionCalculationResult;

  /**
   * Gets the results of any attachment of earnings order calculation for this employee for this
   * payrun, if applicable.
   */
  attachmentOfEarningsCalculationResult?: IAttachmentOfEarningsCalculationResult;

  /**
   * Gets the employee's total gross pay, excluding payrolled taxable benefits.
   */
  totalGrossPay: Money;

  /**
   * Gets the employee's total pay that is subject to National Insurance.
   */
  nicablePay: Money;

  /**
   * Gets the employee's total taxable pay, before the application of any tax-free pay.
   */
  taxablePay: Money;

  /**
   * Gets the employee's final net pay.
   */
  netPay: Money;

  /**
   * Gets the total amount of payrolled benefits in the period, where applicable.  Null if no
   * payrolled benefits have been applied.
   */
  payrollBenefitsInPeriod?: Money;

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

  /**
   * Gets a value indicating whether the employee has shared parental pay in this pay run.
   */
  hasSharedParentalPayInPeriod: boolean;
}
