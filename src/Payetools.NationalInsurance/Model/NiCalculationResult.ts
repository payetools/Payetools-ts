// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { INiThresholdSet } from "../ReferenceData/INiThresholdSet";
import { INiCategoryRatesEntry } from "../ReferenceData/INiCategoryRatesEntry";
import { NiEarningsBreakdown } from "./NiEarningsBreakdown";
import { Money } from "@dintero/money";
import { INiCalculationResult } from "./INiCalculationResult";
import { zeroGbp } from "~/CurrencyHelpers";
import { NiCategoryRatesEntry } from "~/Payetools.ReferenceData/NationalInsurance/NiCategoryRatesEntry";

/**
 * Represents a National Insurance calculation result.
 */
export class NiCalculationResult implements INiCalculationResult {
  /**
   * Gets the NI category used for this calculation.
   */
  public niCategory: NiCategory;

  /**
   * Gets the gross pay for NI purposes ("Nicable pay") used in this calculation.
   */
  public nicablePay: Money = zeroGbp;

  /**
   * Gets the rates used for this calculation.
   */
  public ratesUsed: INiCategoryRatesEntry;

  /**
   * Gets the set of thresholds used for this calculation. These thresholds are adjusted to match the
   * length of the pay period.
   */
  public thresholdsUsed: INiThresholdSet;

  /**
   * Gets the breakdown of earnings across each of the different National Insurance thresholds.
   */
  public earningsBreakdown: NiEarningsBreakdown;

  /**
   * Gets the total employee contribution due as a result of this calculation.
   */
  public employeeContribution: Money = zeroGbp;

  /**
   * Gets the total employer contribution due as a result of this calculation.
   */
  public employerContribution: Money = zeroGbp;

  /**
   * Gets the total contribution due (employee + employer) as a result of this calculation.
   */
  public totalContribution: Money = zeroGbp;

  /**
   * Gets a value indicating whether the results of this calculation need to be reported to HMRC.
   */
  public noRecordingRequired: boolean = false;

  /**
   * Gets the value of any Class 1A National Insurance contributions payable. Null if none.
   */
  public class1ANicsPayable?: Money = zeroGbp;

  /**
   * Initializes a new instance of NiCalculationResult with the supplied values.
   * @param category NI category used for this calculation.
   * @param nicablePay Gross pay for NI purposes ("Nicable pay") used in this calculation.
   * @param ratesUsed Rates used for this calculation.
   * @param thresholdsUsed Thresholds used for this calculation.
   * @param earningsBreakdown Breakdown of earnings across each of the different National Insurance thresholds.
   * @param employeeContribution Total employee contribution due as a result of this calculation.
   * @param employerContribution Total employer contribution due as a result of this calculation.
   * @param totalContribution Total contribution due (employee + employer) as a result of this calculation.
   * @param class1ANicsPayable Value of any Class 1A contributions due.
   */
  constructor(
    niCategory: NiCategory,
    nicablePay: Money,
    ratesUsed: INiCategoryRatesEntry,
    thresholdsUsed: INiThresholdSet,
    earningsBreakdown: NiEarningsBreakdown,
    employeeContribution: Money,
    employerContribution: Money,
    totalContribution?: Money,
    class1ANicsPayable?: Money,
  ) {
    this.niCategory = niCategory;
    this.nicablePay = nicablePay;
    this.ratesUsed = ratesUsed;
    this.thresholdsUsed = thresholdsUsed;
    this.earningsBreakdown = earningsBreakdown;
    this.employeeContribution = employeeContribution;
    this.employerContribution = employerContribution;
    this.totalContribution =
      totalContribution != null
        ? totalContribution
        : employeeContribution.add(employerContribution);
    this.class1ANicsPayable = class1ANicsPayable;
    this.noRecordingRequired = false;
  }

  /**
   * Initialises a new instance of `NiCalculationResult` with zero values except
   * the NI category. Used to indicate that no recording is required.
   * @param {NiCategory} category NI category used for this calculation.
   * @param {Money} nicablePay Gross pay for NI purposes ("Nicable pay") used in this calculation.
   * @param {INiThresholdSet} thresholdsUsed Thresholds used for this calculation.
   */
  public static noRecordingRequiredResult(
    category: NiCategory,
    nicablePay: Money,
    thresholdsUsed: INiThresholdSet,
  ): NiCalculationResult {
    let result = new NiCalculationResult(
      category,
      nicablePay,
      new NiCategoryRatesEntry(NiCategory.Unspecified),
      thresholdsUsed,
      new NiEarningsBreakdown(),
      zeroGbp,
      zeroGbp,
    );

    result.noRecordingRequired = true;

    return result;
  }

  /**
   * Gets the string representation of this calculation result. Intended for debugging/logging purposes.
   * @returns String representation of this calculation result.
   */
  public toString(): string {
    if (this.noRecordingRequired) {
      return `{ NI category: ${this.niCategory}, NoRecordingRequired: ${this.noRecordingRequired} }`;
    }

    return `{ Rates: ${this.ratesUsed.toString()}, Thresholds: ${this.thresholdsUsed.toString()}, Up And including to LEL: ${this.earningsBreakdown.earningsAtLEL}, LEL to PT: ${this.earningsBreakdown.earningsAboveLELUpToAndIncludingST.add(this.earningsBreakdown.earningsAboveSTUpToAndIncludingPT)}, PT to UEL: ${this.earningsBreakdown.earningsAbovePTUpToAndIncludingFUST.add(this.earningsBreakdown.earningsAboveFUSTUpToAndIncludingUEL)}, ST to UEL: ${this.earningsBreakdown.earningsAboveSTUpToAndIncludingUEL}, above UEL: ${this.earningsBreakdown.earningsAboveUEL}; Contributions: Employee ${this.employeeContribution}, Employer ${this.employerContribution}, Total ${this.totalContribution} }`;
  }
}
