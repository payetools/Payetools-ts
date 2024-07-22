// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { IEmployerHistoryEntry } from "./IEmployerHistoryEntry";
import { IPayRunSummary } from "./IPayRunSummary";

/**
 * Interface that represents the year-to-date payroll history for a given employer.
 */
export interface IEmployerYtdHistory {
  /**
   * Gets the tax year that this year-to-date history is for.
   */
  taxYear: TaxYear;

  /**
   * Applies the supplied pay run summary to the relevant month's history entry, based on pay date.
   * @param payRunSummary - Pay run summary to apply.
   */
  apply(payRunSummary: IPayRunSummary): void;

  /**
   * Undoes the previous application of the supplied pay run summary against the relevant month's history entry,
   * based on pay date.
   * @param payRunSummary - Pay run summary to un-apply.
   */
  undoApply(payRunSummary: IPayRunSummary): void;

  /**
   * Gets the year-to-date history by summing up each entry from the start of the tax year up to and including
   * the specified month number.
   * @param monthNumber - Month number to sum up to.
   * @param ytdHistory - IEmployerHistoryEntry containing the summarised data.
   */
  getYearToDateFigures(
    monthNumber: number,
    ytdHistory: IEmployerHistoryEntry,
  ): void;
}
