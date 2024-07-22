// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";

/**
 * Interface for types that detail the various HMRC-published National Insurance threshold levels.
 */
export interface INiCategoryRatesEntry {
  /**
   * Gets the applicable National Insurance Category.
   */
  category: NiCategory;

  /**
   * Gets the employee rate for earnings at or above lower earnings limit up to and including primary threshold.
   */
  employeeRateToPT: Big;

  /**
   * Gets the employee rate for earnings above the primary threshold up to and including upper earnings limit.
   */
  employeeRatePTToUEL: Big;

  /**
   * Gets the employee rate for balance of earnings above upper earnings limit.
   */
  employeeRateAboveUEL: Big;

  /**
   * Gets the employer rate for earnings at or above lower earnings limit up to and including secondary threshold.
   */
  employerRateLELToST: Big;

  /**
   * Gets the employer rate for earnings above secondary threshold up to and including Freeport upper secondary threshold.
   */
  employerRateSTToFUST: Big;

  /**
   * Gets the employer rate for earnings above Freeport upper secondary threshold up to and including upper earnings limit, upper
   * secondary thresholds for under 21s, apprentices and veterans.
   */
  employerRateFUSTToUEL: Big;

  /**
   * Gets the employer rate for balance of earnings above upper earnings limit, upper secondary thresholds for under 21s, apprentices
   * and veterans.
   */
  employerRateAboveUEL: Big;
}
