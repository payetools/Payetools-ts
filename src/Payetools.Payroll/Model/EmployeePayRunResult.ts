// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ITaxCalculationResult } from "~/Payetools.IncomeTax/Model/ITaxCalculationResult";
import { INiCalculationResult } from "~/Payetools.NationalInsurance/Model/INiCalculationResult";
import { IPensionContributionCalculationResult } from "~/Payetools.Pensions/Model/IPensionContributionCalculationResult";
import { IAttachmentOfEarningsCalculationResult } from "~/Payetools.Statutory/AttachmentOfEarnings/IAttachmentOfEarningsCalculationResult";
import { IStudentLoanCalculationResult } from "~/Payetools.StudentLoans/Model/IStudentLoanCalculationResult";
import { IEmployeePayRunResult } from "./IEmployeePayRunResult";
import { IEmployeePayrollHistoryYtd } from "./IEmployeePayrollHistoryYtd";
import { IEmployment } from "./IEmployment";
import { IPayRunDetails } from "./IPayRunDetails";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents a payrun entry for one employee for a specific payrun.
 */
export class EmployeePayRunResult implements IEmployeePayRunResult {
  /**
   * Gets information about this payrun.
   */
  public get PayRunDetails(): IPayRunDetails {
    throw new Error("Not implemented");
  }

  /**
   * Gets the employee's employment details used in calculating this pay run result. The PayrollId property of
   * this field can be used as a hand to get access to the employee.
   */
  public readonly employment: IEmployment;

  /**
   * Gets a value indicating whether this employee is being recorded as left employment in this payrun. Note that
   * the employee's leaving date may be before the start of the pay period for this payrun.
   */
  public readonly isLeaverInThisPayRun: boolean;

  /**
   * Gets a value indicating whether an ex-employee is being paid after the leaving date has been reported to
   * HMRC in a previous submission.
   */
  public readonly isPaymentAfterLeaving: boolean = false;

  /**
   * Gets the results of this employee's income tax calculation for this payrun.
   */
  public readonly taxCalculationResult: ITaxCalculationResult;

  /**
   * Gets the results of this employee's National Insurance calculation for this payrun.
   */
  public readonly niCalculationResult: INiCalculationResult;

  /**
   * Gets the results of this employee's student loan calculation for this payrun, if applicable;
   * null otherwise.
   */
  public readonly studentLoanCalculationResult?: IStudentLoanCalculationResult;

  /**
   * Gets the results of this employee's pension calculation for this payrun, if applicable;
   * null otherwise.
   */
  public readonly pensionContributionCalculationResult?: IPensionContributionCalculationResult;

  /**
   * Gets the results of any attachment of earnings order calculation for this employee for this
   * payrun, if applicable.
   */
  public readonly attachmentOfEarningsCalculationResult?: IAttachmentOfEarningsCalculationResult;

  /**
   * Gets the historical set of information for an employee's payroll for the current tax year,
   * not including the effect of this payrun.
   */
  public readonly employeePayrollHistoryYtd: IEmployeePayrollHistoryYtd;

  /**
   * Gets the employee's total gross pay.
   */
  public readonly totalGrossPay: Money;

  /**
   * Gets the employee's working gross pay, the figure used as the starting point for calculating take-home
   * pay.
   */
  public readonly workingGrossPay: Money;

  /**
   * Gets the employee's final net pay.
   */
  public readonly netPay: Money;

  /**
   * Gets the total amount of payrolled benefits in the period, where applicable. Null if no
   * payrolled benefits have been applied.
   */
  public readonly payrollBenefitsInPeriod?: Money;

  /**
   * Gets the employee's total pay that is subject to National Insurance.
   */
  public readonly nicablePay: Money;

  /**
   * Gets the employee's total taxable pay, before the application of any tax-free pay.
   */
  public readonly taxablePay: Money;

  /**
   * Gets a value indicating whether the employee has shared parental pay in this pay run.
   */
  public readonly hasSharedParentalPayInPeriod: boolean;

  /**
   * Initialises a new instance of <see cref="EmployeePayRunResult"/>.
   */
  constructor(
    employment: IEmployment,
    taxCalculationResult: ITaxCalculationResult,
    niCalculationResult: INiCalculationResult,
    studentLoanCalculationResult: IStudentLoanCalculationResult | null,
    pensionContributionCalculation: IPensionContributionCalculationResult | null,
    attachmentOfEarningsCalculationResult: IAttachmentOfEarningsCalculationResult | null,
    totalGrossPay: Money,
    workingGrossPay: Money,
    taxablePay: Money,
    nicablePay: Money,
    payrollBenefitsInPeriod: Money | null,
    otherDeductions: Money | null,
    employeePayrollHistoryYtd: IEmployeePayrollHistoryYtd,
    isLeaverInThisPayRun = false,
    hasSharedParentalPayInPeriod = false,
  ) {
    this.employment = employment;
    this.taxCalculationResult = taxCalculationResult;
    this.niCalculationResult = niCalculationResult;
    this.studentLoanCalculationResult =
      studentLoanCalculationResult ?? undefined;
    this.pensionContributionCalculationResult =
      pensionContributionCalculation ?? undefined;
    this.attachmentOfEarningsCalculationResult =
      attachmentOfEarningsCalculationResult ?? undefined;
    this.totalGrossPay = totalGrossPay;
    this.workingGrossPay = workingGrossPay;
    this.taxablePay = taxablePay;
    this.nicablePay = nicablePay;
    this.netPay = this.calculateNetPay(
      totalGrossPay,
      taxCalculationResult.finalTaxDue,
      niCalculationResult.employeeContribution,
      this.getEmployeePensionDeduction(
        pensionContributionCalculation ?? undefined,
      ),
      studentLoanCalculationResult?.totalDeduction,
      attachmentOfEarningsCalculationResult?.totalDeduction,
      otherDeductions ?? undefined,
    );
    this.payrollBenefitsInPeriod = payrollBenefitsInPeriod ?? undefined;
    this.employeePayrollHistoryYtd = employeePayrollHistoryYtd;
    this.isLeaverInThisPayRun = isLeaverInThisPayRun;
    this.hasSharedParentalPayInPeriod = hasSharedParentalPayInPeriod;
  }

  private calculateNetPay(
    totalGrossPay: Money,
    incomeTax: Money,
    nationalInsurance: Money,
    employeePension: Money,
    studentLoan?: Money,
    attachmentOfEarningsDeductions?: Money,
    otherDeductions?: Money,
  ): Money {
    return totalGrossPay
      .subtract(incomeTax)
      .subtract(nationalInsurance)
      .subtract(employeePension)
      .subtract(studentLoan ?? zeroGbp)
      .subtract(attachmentOfEarningsDeductions ?? zeroGbp)
      .subtract(otherDeductions ?? zeroGbp);
  }

  private getEmployeePensionDeduction(
    pensionContributionCalculation?: IPensionContributionCalculationResult,
  ): Money {
    if (pensionContributionCalculation) {
      return pensionContributionCalculation.salaryExchangeApplied
        ? pensionContributionCalculation.salaryExchangedAmount ?? zeroGbp
        : pensionContributionCalculation.calculatedEmployeeContributionAmount;
    }
    return zeroGbp;
  }
}
