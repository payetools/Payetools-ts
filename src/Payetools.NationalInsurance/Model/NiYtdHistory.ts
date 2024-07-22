// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { zeroGbp } from "~/CurrencyHelpers";
import { EmployeeNiHistoryEntry } from "./EmployeeNiHistoryEntry";
import { IEmployeeNiHistoryEntry } from "./IEmployeeNiHistoryEntry";
import { INiCalculationResult } from "./INiCalculationResult";
import { Money } from "@dintero/money";

/**
 * Represents an employee's year to date National Insurance history.
 */
export class NiYtdHistory implements Iterable<IEmployeeNiHistoryEntry> {
  private readonly entries: IEmployeeNiHistoryEntry[] = [];

  /**
   * Gets the value of any Class 1A National Insurance contributions payable year to date.
   */
  public class1ANicsYtd?: Money;

  /**
   * Initialises a new instance of <see cref="NiYtdHistory"/> with the supplied NI calculation result.  This
   * constructor is intended to be used for the first time a payrun is run during the tax year.
   */
  public static fromNiCalculationResult(
    initialNiCalculationResult: INiCalculationResult,
  ) {
    return new NiYtdHistory(
      [
        EmployeeNiHistoryEntry.fromNiCalculationResult(
          initialNiCalculationResult,
        ),
      ],
      initialNiCalculationResult.class1ANicsPayable,
    );
  }

  /**
   * Initialises a new instance of <see cref="NiYtdHistory"/>.
   */
  constructor(entries: IEmployeeNiHistoryEntry[], class1ANicsYtd?: Money) {
    this.entries = entries;
    this.class1ANicsYtd = class1ANicsYtd;
  }

  /**
   * Returns a new instance of `NiYtdHistory` with the previous history updated by the latest
   * payrun result. Where an entry in the history matches the current NI category, that entry
   * is updated, but otherwise a new history entry is created and appended.
   *
   * @param latestNiCalculationResult Result of this payrun's NI calculation.
   * @returns A new instance of `NiYtdHistory` with the previous history updated by the latest
   * payrun result.
   */
  public add(latestNiCalculationResult: INiCalculationResult): NiYtdHistory {
    let index: number;
    let entryAlreadyPresent = false;

    for (index = 0; index < this.entries.length; index++) {
      if (
        (entryAlreadyPresent =
          this.entries[index].niCategoryPertaining ===
          latestNiCalculationResult.niCategory)
      ) {
        break;
      }
    }

    const class1ANicsYtd =
      latestNiCalculationResult.class1ANicsPayable == null &&
      this.class1ANicsYtd == null
        ? undefined
        : (latestNiCalculationResult.class1ANicsPayable ?? zeroGbp).add(
            this.class1ANicsYtd ?? zeroGbp,
          );

    return entryAlreadyPresent
      ? new NiYtdHistory(
          [
            ...this.entries.slice(0, index),
            this.entries[index].add(latestNiCalculationResult),
            ...this.entries.slice(index + 1),
          ],
          class1ANicsYtd,
        )
      : new NiYtdHistory(
          [
            ...this.entries,
            EmployeeNiHistoryEntry.fromNiCalculationResult(
              latestNiCalculationResult,
            ),
          ],
          class1ANicsYtd,
        );
  }

  /**
   * Gets the totals of employee and employer NI contributions paid to date across all entries.
   *
   * @returns Totals of employee and employer NI contributions paid tear to date.
   */
  public getNiYtdTotals(): { employeeTotal: Money; employerTotal: Money } {
    return {
      employeeTotal: this.entries
        .map((e) => e.employeeContribution)
        .reduce((sum, value) => sum.add(value)),
      employerTotal: this.entries
        .map((e) => e.employerContribution)
        .reduce((sum, value) => sum.add(value)),
    };
  }

  /**
   * Gets an enumerator to enumerate over the employee's NI history entries by NI category.
   *
   * @returns Enumerator for enumerating over the employee's NI history entries.
   */
  public [Symbol.iterator](): Iterator<IEmployeeNiHistoryEntry> {
    return this.entries[Symbol.iterator]();
  }
}
