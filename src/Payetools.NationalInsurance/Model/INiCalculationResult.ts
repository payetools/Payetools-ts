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

/**
 * Interface for types representing National Insurance calculation results.
 */
export interface INiCalculationResult {
  /**
   * Gets the NI category used for this calculation.
   */
  niCategory: NiCategory;

  /**
   * Gets the gross pay for NI purposes ("Nicable pay") used in this calculation.
   */
  nicablePay: Money;

  /**
   * Gets the rates used for this calculation.
   */
  ratesUsed: INiCategoryRatesEntry;

  /**
   * Gets the set of thresholds used for this calculation. These thresholds are adjusted to match the
   * length of the pay period.
   */
  thresholdsUsed: INiThresholdSet;

  /**
   * Gets the breakdown of earnings across each of the different National Insurance thresholds.
   */
  earningsBreakdown: NiEarningsBreakdown;

  /**
   * Gets the total employee contribution due as a result of this calculation.
   */
  employeeContribution: Money;

  /**
   * Gets the total employer contribution due as a result of this calculation.
   */
  employerContribution: Money;

  /**
   * Gets the total contribution due (employee + employer) as a result of this calculation.
   */
  totalContribution: Money;

  /**
   * Gets a value indicating whether the results of this calculation need to be reported to HMRC.
   */
  noRecordingRequired: boolean;

  /**
   * Gets the value of any Class 1A National Insurance contributions payable. Null if none.
   */
  class1ANicsPayable?: Money;
}
