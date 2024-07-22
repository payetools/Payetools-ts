// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { NiYtdHistory } from "~/Payetools.NationalInsurance/Model/NiYtdHistory";
import { IPensionContributionCalculationResult } from "~/Payetools.Pensions/Model/IPensionContributionCalculationResult";
import { DeductionsHistoryYtd } from "./DeductionsHistoryYtd";
import { EarningsHistoryYtd } from "./EarningsHistoryYtd";
import { IDeductionsHistoryYtd } from "./IDeductionsHistoryYtd";
import { IEarningsHistoryYtd } from "./IEarningsHistoryYtd";
import { IEmployeePayRunInputEntry } from "./IEmployeePayRunInputEntry";
import { IEmployeePayRunResult } from "./IEmployeePayRunResult";
import { IEmployeePayrollHistoryYtd } from "./IEmployeePayrollHistoryYtd";
import { PaymentType } from "./PaymentType";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents the historical set of information for an employee's payroll for the
 * current tax year.
 */
export class EmployeePayrollHistoryYtd implements IEmployeePayrollHistoryYtd {
  /**
   * Gets any statutory maternity pay paid to date this tax year.
   */
  public statutoryMaternityPayYtd: Money = zeroGbp;

  /**
   * Gets any statutory paternity pay paid to date this tax year.
   */
  public statutoryPaternityPayYtd: Money = zeroGbp;

  /**
   * Gets any statutory adoption pay paid to date this tax year.
   */
  public statutoryAdoptionPayYtd: Money = zeroGbp;

  /**
   * Gets any statutory shared parental pay paid to date this tax year.
   */
  public statutorySharedParentalPayYtd: Money = zeroGbp;

  /**
   * Gets any statutory parental bereavement pay paid to date this tax year.
   */
  public statutoryParentalBereavementPayYtd: Money = zeroGbp;

  /**
   * Gets any statutory sickness pay paid to date this tax year.
   */
  public statutorySickPayYtd: Money = zeroGbp;

  /**
   * Gets the National Insurance payment history for the current tax year.  Employees may
   * transition between NI categories during the tax year and each NI category's payment
   * record must be retained.
   */
  public employeeNiHistoryEntries: NiYtdHistory = new NiYtdHistory([]);

  /**
   * Gets the gross pay paid to date this tax year.
   */
  public grossPayYtd: Money = zeroGbp;

  /**
   * Gets the taxable pay paid to date this tax year.
   */
  public taxablePayYtd: Money = zeroGbp;

  /**
   * Gets the NI-able pay paid to date this tax year.
   */
  public nicablePayYtd: Money = zeroGbp;

  /**
   * Gets the income tax paid to date this tax year.
   */
  public taxPaidYtd: Money = zeroGbp;

  /**
   * Gets the student loan deductions made to date this tax year.
   */
  public studentLoanRepaymentsYtd: Money = zeroGbp;

  /**
   * Gets the postgraduate loan deductions made to date this tax year.
   */
  public postgraduateLoanRepaymentsYtd: Money = zeroGbp;

  /**
   * Gets the amount accrued against payrolled benefits to date this tax year.
   */
  public payrolledBenefitsYtd: Money = zeroGbp;

  /**
   * Gets the total employee pension contributions made under a net pay arrangement to date this tax year.
   */
  public employeePensionContributionsUnderNpaYtd: Money = zeroGbp;

  /**
   * Gets the total employee pension contributions made under relief at source to date this tax year.
   */
  public employeePensionContributionsUnderRasYtd: Money = zeroGbp;

  /**
   * Gets the total employer pension contributions made to date this tax year.
   */
  public employerPensionContributionsYtd: Money = zeroGbp;

  /**
   * Gets the tax that it has not been possible to collect so far this tax year due to the
   * regulatory limit on income tax deductions.
   */
  public taxUnpaidDueToRegulatoryLimit: Money = zeroGbp;

  /**
   * Gets the employee's earnings history for the tax year to date.
   */
  public earningsHistoryYtd: IEarningsHistoryYtd = new EarningsHistoryYtd();

  /**
   * Gets the employee's deduction history for the tax year to date.
   */
  public deductionsHistoryYtd: IDeductionsHistoryYtd =
    new DeductionsHistoryYtd();

  private static fromHistories(
    earningsHistoryYtd: IEarningsHistoryYtd,
    deductionsHistoryYtd: IDeductionsHistoryYtd,
  ) {
    const history: IEmployeePayrollHistoryYtd = new EmployeePayrollHistoryYtd();

    history.earningsHistoryYtd = earningsHistoryYtd;
    history.deductionsHistoryYtd = deductionsHistoryYtd;

    return history;
  }

  /**
   * Adds the results of the payrun provided to the current instance and returns a new instance of
   * IEmployeePayrollHistoryYtd.
   * @param payRunInput Employee pay run input entry.
   * @param payrunResult Results of a set of payroll calculations for a given employee.
   * @returns New instance of IEmployeePayrollHistoryYtd with the calculation results applied.
   */
  public add(
    payRunInput: IEmployeePayRunInputEntry,
    payrunResult: IEmployeePayRunResult,
  ): IEmployeePayrollHistoryYtd {
    const hasPension: boolean =
      payrunResult.pensionContributionCalculationResult != null;

    const newHistory: IEmployeePayrollHistoryYtd =
      EmployeePayrollHistoryYtd.fromHistories(
        this.earningsHistoryYtd.apply(payRunInput.earnings),
        this.deductionsHistoryYtd.apply(payRunInput.deductions),
      );

    newHistory.statutoryMaternityPayYtd = this.statutoryMaternityPayYtd.add(
      payRunInput.earnings
        .filter(
          (e) =>
            e.earningsDetails.paymentType === PaymentType.StatutoryMaternityPay,
        )
        .map((e) => e.totalEarnings)
        .reduce((a, b) => a.add(b), zeroGbp),
    );

    newHistory.statutoryPaternityPayYtd = this.statutoryMaternityPayYtd.add(
      payRunInput.earnings
        .filter(
          (e) =>
            e.earningsDetails.paymentType === PaymentType.StatutoryPaternityPay,
        )
        .map((e) => e.totalEarnings)
        .reduce((a, b) => a.add(b), zeroGbp),
    );

    newHistory.statutoryAdoptionPayYtd = this.statutoryMaternityPayYtd.add(
      payRunInput.earnings
        .filter(
          (e) =>
            e.earningsDetails.paymentType === PaymentType.StatutoryAdoptionPay,
        )
        .map((e) => e.totalEarnings)
        .reduce((a, b) => a.add(b), zeroGbp),
    );

    newHistory.statutorySharedParentalPayYtd =
      this.statutoryMaternityPayYtd.add(
        payRunInput.earnings
          .filter(
            (e) =>
              e.earningsDetails.paymentType ===
              PaymentType.StatutorySharedParentalPay,
          )
          .map((e) => e.totalEarnings)
          .reduce((a, b) => a.add(b), zeroGbp),
      );

    newHistory.statutoryParentalBereavementPayYtd =
      this.statutoryMaternityPayYtd.add(
        payRunInput.earnings
          .filter(
            (e) =>
              e.earningsDetails.paymentType ===
              PaymentType.StatutoryParentalBereavementPay,
          )
          .map((e) => e.totalEarnings)
          .reduce((a, b) => a.add(b), zeroGbp),
      );

    newHistory.employeeNiHistoryEntries = this.employeeNiHistoryEntries.add(
      payrunResult.niCalculationResult,
    );

    newHistory.grossPayYtd = this.grossPayYtd.add(payrunResult.totalGrossPay);
    newHistory.taxablePayYtd = this.taxablePayYtd.add(payrunResult.taxablePay);
    newHistory.nicablePayYtd = this.nicablePayYtd.add(payrunResult.nicablePay);
    newHistory.taxPaidYtd = this.taxPaidYtd.add(
      payrunResult.taxCalculationResult.finalTaxDue,
    );
    newHistory.studentLoanRepaymentsYtd = this.studentLoanRepaymentsYtd.add(
      payrunResult.studentLoanCalculationResult?.studentLoanDeduction ??
        zeroGbp,
    );
    newHistory.postgraduateLoanRepaymentsYtd =
      this.postgraduateLoanRepaymentsYtd.add(
        payrunResult.studentLoanCalculationResult?.postgraduateLoanDeduction ??
          zeroGbp,
      );

    newHistory.payrolledBenefitsYtd = this.payrolledBenefitsYtd.add(
      payRunInput.payrolledBenefits
        .map((pb) => pb.amountForPeriod)
        .reduce((a, b) => a.add(b), zeroGbp),
    );

    newHistory.employeePensionContributionsUnderNpaYtd =
      this.employeePensionContributionsUnderNpaYtd.add(
        hasPension &&
          EmployeePayrollHistoryYtd.pensionIsUnderNpa(
            payrunResult.pensionContributionCalculationResult,
          )
          ? payrunResult.pensionContributionCalculationResult!
              .calculatedEmployeeContributionAmount
          : zeroGbp,
      );

    newHistory.employeePensionContributionsUnderRasYtd =
      this.employeePensionContributionsUnderRasYtd.add(
        hasPension &&
          !EmployeePayrollHistoryYtd.pensionIsUnderNpa(
            payrunResult.pensionContributionCalculationResult,
          )
          ? payrunResult.pensionContributionCalculationResult!
              .calculatedEmployeeContributionAmount
          : zeroGbp,
      );

    newHistory.employerPensionContributionsYtd =
      this.employerPensionContributionsYtd.add(
        payrunResult.pensionContributionCalculationResult
          ?.calculatedEmployerContributionAmount ?? zeroGbp,
      );

    newHistory.taxUnpaidDueToRegulatoryLimit =
      this.taxUnpaidDueToRegulatoryLimit.add(
        payrunResult.taxCalculationResult.taxUnpaidDueToRegulatoryLimit,
      );

    return newHistory;
  }

  /**
   * Returns true if the supplied payment type is one that can be reclaimed from HMRC, as these are treated differently within this
   * entity and the associated earnings history.
   * @param paymentType Payment type.
   * @returns True if the supplied payment type is one that can be reclaimed from HMRC; otherwise false.
   */
  public static isReclaimableStatutoryPayment(
    paymentType: PaymentType,
  ): boolean {
    return (
      paymentType === PaymentType.StatutoryMaternityPay ||
      paymentType === PaymentType.StatutoryAdoptionPay ||
      paymentType === PaymentType.StatutoryPaternityPay ||
      paymentType === PaymentType.StatutorySharedParentalPay ||
      paymentType === PaymentType.StatutoryParentalBereavementPay
    );
  }

  private static pensionIsUnderNpa(
    pensionCalculationResult?: IPensionContributionCalculationResult,
  ): boolean {
    return (
      pensionCalculationResult?.taxTreatment ===
      PensionTaxTreatment.NetPayArrangement
    );
  }
}
