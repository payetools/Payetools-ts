// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IEmployerHistoryEntry } from "./IEmployerHistoryEntry";
import { IPayRunSummary } from "./IPayRunSummary";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents summarised pay run information across all pay runs for a given tax month.
 */
export class EmployerHistoryEntry implements IEmployerHistoryEntry {
  /**
   * Gets the applicable month number for this year-to-date entry.
   */
  public monthNumber: number = 0;

  /**
   * Gets the total amount of income tax for the tax month. May be zero.
   */
  public totalIncomeTax: Money = zeroGbp;

  /**
   * Gets the total amount of student loan repayment for the tax month. May be zero.
   */
  public totalStudentLoans: Money = zeroGbp;

  /**
   * Gets the total amount of postgraduate loan repayment for the tax month. May be zero.
   */
  public totalPostgraduateLoans: Money = zeroGbp;

  /**
   * Gets the total amount of employer's National Insurance for the tax month. May be zero.
   */
  public employerNiTotal: Money = zeroGbp;

  /**
   * Gets the total amount employee's National Insurance for the tax month. May be zero.
   */
  public employeeNiTotal: Money = zeroGbp;

  /**
   * Gets the total Statutory Maternity Pay amount for the month. May be zero.
   */
  public totalStatutoryMaternityPay: Money = zeroGbp;

  /**
   * Gets the total Statutory Paternity Pay amount for the tax month. May be zero.
   */
  public totalStatutoryPaternityPay: Money = zeroGbp;

  /**
   * Gets the total Statutory Adoption Pay amount for the tax month. May be zero.
   */
  public totalStatutoryAdoptionPay: Money = zeroGbp;

  /**
   * Gets the total Statutory Shared Parental Pay amount for the tax month. May be zero.
   */
  public totalStatutorySharedParentalPay: Money = zeroGbp;

  /**
   * Gets the total Statutory Parental Bereavement Pay amount for the tax month. May be zero.
   */
  public totalStatutoryParentalBereavementPay: Money = zeroGbp;

  constructor(
    monthNumber: number,
    totalIncomeTax: Money,
    totalStudentLoans: Money,
    totalPostgraduateLoans: Money,
    employerNiTotal: Money,
    employeeNiTotal: Money,
    totalStatutoryMaternityPay: Money,
    totalStatutoryPaternityPay: Money,
    totalStatutoryAdoptionPay: Money,
    totalStatutorySharedParentalPay: Money,
    totalStatutoryParentalBereavementPay: Money,
  ) {
    this.monthNumber = monthNumber;
    this.totalIncomeTax = totalIncomeTax;
    this.totalStudentLoans = totalStudentLoans;
    this.totalPostgraduateLoans = totalPostgraduateLoans;
    this.employerNiTotal = employerNiTotal;
    this.employeeNiTotal = employeeNiTotal;
    this.totalStatutoryMaternityPay = totalStatutoryMaternityPay;
    this.totalStatutoryPaternityPay = totalStatutoryPaternityPay;
    this.totalStatutoryAdoptionPay = totalStatutoryAdoptionPay;
    this.totalStatutorySharedParentalPay = totalStatutorySharedParentalPay;
    this.totalStatutoryParentalBereavementPay =
      totalStatutoryParentalBereavementPay;
  }

  /**
   * Applies the supplied pay run summary to this history entry and returns a new updated `EmployerHistoryEntry`.
   * @param summary Pay run summary to apply.
   * @returns New `EmployerHistoryEntry` with the supplied pay run summary applied.
   */
  public apply(summary: IPayRunSummary): EmployerHistoryEntry {
    return new EmployerHistoryEntry(
      this.monthNumber,
      this.totalIncomeTax.add(summary.incomeTaxTotal),
      this.totalStudentLoans.add(summary.studentLoansTotal),
      this.totalPostgraduateLoans.add(summary.postgraduateLoansTotal),
      this.employerNiTotal.add(summary.employerNiTotal),
      this.employeeNiTotal.add(summary.employeeNiTotal),
      this.totalStatutoryMaternityPay.add(summary.statutoryMaternityPayTotal),
      this.totalStatutoryPaternityPay.add(summary.statutoryPaternityPayTotal),
      this.totalStatutoryAdoptionPay.add(summary.statutoryAdoptionPayTotal),
      this.totalStatutorySharedParentalPay.add(
        summary.statutorySharedParentalPayTotal,
      ),
      this.totalStatutoryParentalBereavementPay.add(
        summary.statutoryParentalBereavementPayTotal,
      ),
    );
  }

  /**
   * Undoes the previous application of a pay run summary on this history entry and returns a new updated `IEmployerHistoryEntry` instance.
   * @param summary Pay run summary to un-apply.
   * @returns New entity that implements `IEmployerHistoryEntry` with the supplied pay run summary un-applied.
   */
  public undoApply(summary: IPayRunSummary): IEmployerHistoryEntry {
    return new EmployerHistoryEntry(
      this.monthNumber,
      this.totalIncomeTax.subtract(summary.incomeTaxTotal),
      this.totalStudentLoans.subtract(summary.studentLoansTotal),
      this.totalPostgraduateLoans.subtract(summary.postgraduateLoansTotal),
      this.employerNiTotal.subtract(summary.employerNiTotal),
      this.employeeNiTotal.subtract(summary.employeeNiTotal),
      this.totalStatutoryMaternityPay.subtract(
        summary.statutoryMaternityPayTotal,
      ),
      this.totalStatutoryPaternityPay.subtract(
        summary.statutoryPaternityPayTotal,
      ),
      this.totalStatutoryAdoptionPay.subtract(
        summary.statutoryAdoptionPayTotal,
      ),
      this.totalStatutorySharedParentalPay.subtract(
        summary.statutorySharedParentalPayTotal,
      ),
      this.totalStatutoryParentalBereavementPay.subtract(
        summary.statutoryParentalBereavementPayTotal,
      ),
    );
  }
}
