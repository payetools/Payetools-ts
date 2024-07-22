import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { IEmployeeNiHistoryEntry } from "./IEmployeeNiHistoryEntry";
import { NiEarningsBreakdown } from "./NiEarningsBreakdown";
import { INiCalculationResult } from "./INiCalculationResult";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents one element of the employee's NI history during the current tax year. For employees that have only
 * have one NI category throughout the tax year, they will have just one instance of `EmployeeNiHistoryEntry`
 * applicable. But it is of course possible for an employee's NI category to change throughout the tax year (for example
 * because they turned 21 years of age), and in this case, multiple records must be held.
 */
export class EmployeeNiHistoryEntry implements IEmployeeNiHistoryEntry {
  /**
   * Gets the National Insurance category letter pertaining to this record.
   */
  public readonly niCategoryPertaining: NiCategory;

  /**
   * Gets the gross NI-able earnings applicable for the duration of this record.
   */
  public readonly grossNicableEarnings: Money;

  /**
   * Gets the total employee contribution made during the duration of this record.
   */
  public readonly employeeContribution: Money;

  /**
   * Gets the total employer contribution made during the duration of this record.
   */
  public readonly employerContribution: Money;

  /**
   * Gets the total contribution (employee.add(employer) made during the duration of this record).
   */
  public readonly totalContribution: Money;

  /**
   * Gets the earnings up to and including the Lower Earnings Limit for this record.
   */
  public earningsAtLEL: Money = zeroGbp;

  /**
   * Gets the earnings up above the Lower Earnings Limit and up to and including the Secondary Threshold
   * for this record.
   */
  public earningsAboveLELUpToAndIncludingST: Money = zeroGbp;

  /**
   * Gets the earnings up above the Secondary Threshold and up to and including the Primary Threshold
   * for this record.
   */
  public earningsAboveSTUpToAndIncludingPT: Money = zeroGbp;

  /**
   * Gets the earnings up above the Primary Threshold and up to and including the Freeport Upper Secondary
   * Threshold for this record.
   */
  public earningsAbovePTUpToAndIncludingFUST: Money = zeroGbp;

  /**
   * Gets the earnings up above the Freeport Upper Secondary Threshold and up to and including the Upper
   * Earnings Limit for this record.
   */
  public earningsAboveFUSTUpToAndIncludingUEL: Money = zeroGbp;

  /**
   * Gets the earnings up above the Upper Earnings Limit for this record.
   */
  public earningsAboveUEL: Money = zeroGbp;

  /**
   * Gets the earnings up above the Secondary Threshold and up to and including the Upper Earnings Limit
   * for this record.
   */
  public earningsAboveSTUpToAndIncludingUEL: Money = zeroGbp;

  /**
   * Initializes a new instance of the `EmployeeNiHistoryEntry` with the supplied data.
   * @param niCategoryPertaining National Insurance category that this history entry relates to.
   * @param grossNicableEarnings Gross NICable earnings year-to-date for this NI category.
   * @param employeeContribution Total employee NI contribution year-to-date for this NI category.
   * @param employerContribution Total employer NI contribution year-to-date for this NI category.
   * @param totalContribution Total NI contributions (employee+employer) year-to-date for this NI category.
   * @param niEarningsBreakdown National Insurance earnings breakdown by threshold.
   * @remarks When working with the output of a pay run, use the single-parameter constructor that
   * takes a `NiCalculationResult` instead of this constructor. This constructor is
   * intended to allow external code to generate an `EmployeeNiHistoryEntry` from
   * scratch outside of a payroll pay run, for example, when hydrating an instance of this type
   * from a database.
   */
  constructor(
    niCategoryPertaining: NiCategory,
    grossNicableEarnings: Money,
    employeeContribution: Money,
    employerContribution: Money,
    totalContribution: Money,
    niEarningsBreakdown?: NiEarningsBreakdown,
  ) {
    this.niCategoryPertaining = niCategoryPertaining;
    this.grossNicableEarnings = grossNicableEarnings;
    this.employeeContribution = employeeContribution;
    this.employerContribution = employerContribution;
    this.totalContribution = totalContribution;
    if (niEarningsBreakdown) {
      this.earningsAtLEL = niEarningsBreakdown.earningsAtLEL;
      this.earningsAboveLELUpToAndIncludingST =
        niEarningsBreakdown.earningsAboveLELUpToAndIncludingST;
      this.earningsAboveSTUpToAndIncludingPT =
        niEarningsBreakdown.earningsAboveSTUpToAndIncludingPT;
      this.earningsAbovePTUpToAndIncludingFUST =
        niEarningsBreakdown.earningsAbovePTUpToAndIncludingFUST;
      this.earningsAboveFUSTUpToAndIncludingUEL =
        niEarningsBreakdown.earningsAboveFUSTUpToAndIncludingUEL;
      this.earningsAboveUEL = niEarningsBreakdown.earningsAboveUEL;
      this.earningsAboveSTUpToAndIncludingUEL =
        niEarningsBreakdown.earningsAboveSTUpToAndIncludingUEL;
    }
  }

  /**
   * Initialises a new `EmployeeNiHistoryEntry` from the supplied calculation result.
   * @param result NI calculation result.
   */
  public static fromNiCalculationResult(
    result: INiCalculationResult,
  ): IEmployeeNiHistoryEntry {
    const breakdown = result.earningsBreakdown;
    return new EmployeeNiHistoryEntry(
      result.niCategory,
      result.nicablePay,
      result.employeeContribution,
      result.employerContribution,
      result.totalContribution,
      result.earningsBreakdown,
    );
  }

  /**
   * Adds the results of an NI calculation to the current history and returns a new instance of `IEmployeeNiHistoryEntry`
   * with the results applied.
   * @param result NI calculation results to add to this history entry.
   * @returns New instance of `IEmployeeNiHistoryEntry` with the NI calculation result applied.
   */
  public add(result: INiCalculationResult): IEmployeeNiHistoryEntry {
    if (this.niCategoryPertaining !== result.niCategory) {
      throw new Error(
        `NI calculation result applies to category ${result.niCategory} which is different to previous entry ${this.niCategoryPertaining}`,
      );
    }

    const breakdown = result.earningsBreakdown;

    const entry = new EmployeeNiHistoryEntry(
      this.niCategoryPertaining,
      this.grossNicableEarnings.add(result.nicablePay),
      this.employeeContribution.add(result.employeeContribution),
      this.employerContribution.add(result.employerContribution),
      this.totalContribution.add(result.totalContribution),
    );
    entry.earningsAtLEL = this.earningsAtLEL.add(breakdown.earningsAtLEL);
    entry.earningsAboveLELUpToAndIncludingST =
      this.earningsAboveLELUpToAndIncludingST.add(
        breakdown.earningsAboveLELUpToAndIncludingST,
      );
    entry.earningsAboveSTUpToAndIncludingPT =
      this.earningsAboveSTUpToAndIncludingPT.add(
        breakdown.earningsAboveSTUpToAndIncludingPT,
      );
    entry.earningsAbovePTUpToAndIncludingFUST =
      this.earningsAbovePTUpToAndIncludingFUST.add(
        breakdown.earningsAbovePTUpToAndIncludingFUST,
      );
    entry.earningsAboveFUSTUpToAndIncludingUEL =
      this.earningsAboveFUSTUpToAndIncludingUEL.add(
        breakdown.earningsAboveFUSTUpToAndIncludingUEL,
      );
    entry.earningsAboveUEL = this.earningsAboveUEL.add(
      breakdown.earningsAboveUEL,
    );
    entry.earningsAboveSTUpToAndIncludingUEL =
      this.earningsAboveSTUpToAndIncludingUEL.add(
        breakdown.earningsAboveSTUpToAndIncludingUEL,
      );

    return entry;
  }
}
