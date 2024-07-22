// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PensionsThresholdEntry } from "~/Payetools.ReferenceData/Pensions/PensionsThresholdEntry";

/**
 * Interface that classes must implement to provide access to pensions reference data, for example, lower and upper thresholds
 * for Qualifying Earnings.
 */
export interface PensionsReferenceDataSet {
  /**
   * Gets the lower level for Qualifying Earnings for each pay frequency.
   */
  lowerLevelForQualifyingEarnings: PensionsThresholdEntry;

  /**
   * Gets the earnings trigger for Auto-Enrolment for each pay frequency.
   */
  earningsTriggerForAutoEnrolment: PensionsThresholdEntry;

  /**
   * Gets the upper level for Qualifying Earnings for each pay frequency.
   */
  upperLevelForQualifyingEarnings: PensionsThresholdEntry;
}
