// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IPayRunSummary } from "./IPayRunSummary";

/**
 * Interface that represents summarised pay run information for a given tax month.
 */
export interface IEmployerHistoryEntry {
  /**
   * Gets the applicable month number for this year-to-date entry.
   */
  monthNumber: number;

  /**
   * Gets the total amount of income tax for the tax month. May be zero.
   */
  totalIncomeTax: Money;

  /**
   * Gets the total amount of student loan repayment for the tax month. May be zero.
   */
  totalStudentLoans: Money;

  /**
   * Gets the total amount of postgraduate loan repayment for the tax month. May be zero.
   */
  totalPostgraduateLoans: Money;

  /**
   * Gets the total amount of employer's National Insurance for the tax month. May be zero.
   */
  employerNiTotal: Money;

  /**
   * Gets the total amount employee's National Insurance for the tax month. May be zero.
   */
  employeeNiTotal: Money;

  /**
   * Gets the total Statutory Maternity Pay amount for the tax month.  May be zero.
   */
  totalStatutoryMaternityPay: Money;

  /**
   * Gets the total Statutory Paternity Pay amount for the tax month.  May be zero.
   */
  totalStatutoryPaternityPay: Money;

  /**
   * Gets the total Statutory Adoption Pay amount for the tax month.  May be zero.
   */
  totalStatutoryAdoptionPay: Money;

  /**
   * Gets the total Statutory Shared Parental Pay amount for the tax month.  May be zero.
   */
  totalStatutorySharedParentalPay: Money;

  /**
   * Gets the total Statutory Parental Bereavement Pay amount for the tax month.  May be zero.
   */
  totalStatutoryParentalBereavementPay: Money;

  /**
   * Applies the supplied pay run summary to this history entry and returns a new updated <see cref="IEmployerHistoryEntry"/> instance.
   * @param summary Pay run summary to apply.
   * @returns New entity that implements <see cref="IEmployerHistoryEntry"/> with the supplied pay run summary applied.
   */
  apply(summary: IPayRunSummary): IEmployerHistoryEntry;

  /**
   * Undoes the previous application of a pay run summary on this history entry and returns a new updated <see cref="IEmployerHistoryEntry"/> instance.
   * @param summary Pay run summary to un-apply.
   * @returns New entity that implements <see cref="IEmployerHistoryEntry"/> with the supplied pay run summary un-applied.
   */
  undoApply(summary: IPayRunSummary): IEmployerHistoryEntry;
}
