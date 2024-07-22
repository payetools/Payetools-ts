// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { IEmployerHistoryEntry } from "./IEmployerHistoryEntry";
import { IEmployerYtdHistory } from "./IEmployerYtdHistory";
import { IPayRunSummary } from "./IPayRunSummary";
import { EmployerHistoryEntry } from "./EmployerHistoryEntry";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents the year-to-date payroll history for a given employer.
 */
class EmployerYtdHistory implements IEmployerYtdHistory {
  private readonly historyEntries: IEmployerHistoryEntry[] = new Array(12);

  /**
   * Gets the tax year that this year-to-date history is for.
   */
  public taxYear: TaxYear;

  /**
   * Initializes a new instance of the EmployerYtdHistory class.
   * @param taxYear - Tax year pertaining.
   */
  constructor(taxYear: TaxYear) {
    this.taxYear = taxYear;
  }

  /**
   * Applies the supplied pay run summary to the relevant month's history entry, based on pay date.
   * @param payRunSummary - Pay run summary to apply.
   */
  public apply(payRunSummary: IPayRunSummary): void {
    const monthNumber = this.taxYear.getMonthNumberForPayDate(
      payRunSummary.payDate,
    );
    const index = monthNumber - 1;

    const hasExistingEntry = this.historyEntries[index] != null;

    this.historyEntries[index] = hasExistingEntry
      ? this.historyEntries[index].apply(payRunSummary)
      : this.createEntryFromPayRun(monthNumber, payRunSummary);
  }

  /**
   * Undoes the previous application of the supplied pay run summary against the relevant month's history entry,
   * based on pay date.
   * @param payRunSummary - Pay run summary to un-apply.
   */
  public undoApply(payRunSummary: IPayRunSummary): void {
    const monthNumber = this.taxYear.getMonthNumberForPayDate(
      payRunSummary.payDate,
    );
    const index = monthNumber - 1;

    if (this.historyEntries[index] == null) {
      throw new Error(
        `No history for month number ${monthNumber} available to undo`,
      );
    }

    this.historyEntries[index] =
      this.historyEntries[index].undoApply(payRunSummary);
  }

  /**
   * Gets the year-to-date history by summing up each entry from the start of the tax year up to and including
   * the specified month number.
   * @param monthNumber - Month number to sum up to.
   * @param ytdHistory - A new IEmployerHistoryEntry containing the summarised data.
   */
  public getYearToDateFigures(
    monthNumber: number,
    ytdHistory: IEmployerHistoryEntry,
  ): void {
    const month = monthNumber;

    if (month < 1 || month > 12) {
      throw new Error(
        `Invalid month number ${month}; value must be between 1 and 12`,
      );
    }

    const entries = this.historyEntries.filter(
      (e) => e != null && e.monthNumber <= month,
    );

    ytdHistory = new EmployerHistoryEntry(
      month,
      entries.reduce((sum, e) => sum.add(e.totalIncomeTax), zeroGbp),
      entries.reduce((sum, e) => sum.add(e.totalStudentLoans), zeroGbp),
      entries.reduce((sum, e) => sum.add(e.totalPostgraduateLoans), zeroGbp),
      entries.reduce((sum, e) => sum.add(e.employerNiTotal), zeroGbp),
      entries.reduce((sum, e) => sum.add(e.employeeNiTotal), zeroGbp),
      entries.reduce(
        (sum, e) => sum.add(e.totalStatutoryMaternityPay),
        zeroGbp,
      ),
      entries.reduce(
        (sum, e) => sum.add(e.totalStatutoryPaternityPay),
        zeroGbp,
      ),
      entries.reduce((sum, e) => sum.add(e.totalStatutoryAdoptionPay), zeroGbp),
      entries.reduce(
        (sum, e) => sum.add(e.totalStatutorySharedParentalPay),
        zeroGbp,
      ),
      entries.reduce(
        (sum, e) => sum.add(e.totalStatutoryParentalBereavementPay),
        zeroGbp,
      ),
    );
  }

  private createEntryFromPayRun(
    monthNumber: number,
    summary: IPayRunSummary,
  ): EmployerHistoryEntry {
    return new EmployerHistoryEntry(
      monthNumber,
      summary.incomeTaxTotal,
      summary.studentLoansTotal,
      summary.postgraduateLoansTotal,
      summary.employerNiTotal,
      summary.employeeNiTotal,
      summary.statutoryMaternityPayTotal,
      summary.statutoryPaternityPayTotal,
      summary.statutoryAdoptionPayTotal,
      summary.statutorySharedParentalPayTotal,
      summary.statutoryParentalBereavementPayTotal,
    );
  }
}
