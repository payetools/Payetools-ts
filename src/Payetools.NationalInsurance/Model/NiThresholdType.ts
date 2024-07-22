// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Enum enumerating the various National Insurance threshold levels.
 */
export enum NiThresholdType {
  /** Lower Earnings Limit */
  LEL = 0,

  /** Primary Threshold */
  PT = 1,

  /** Secondary Threshold */
  ST = 2,

  /** Freeport Upper Secondary Threshold */
  FUST = 3,

  /** Upper Secondary Threshold */
  UST = 4,

  /** Apprentice Upper Secondary Threshold */
  AUST = 5,

  /** Veterans Upper Secondary Threshold */
  VUST = 6,

  /** Upper Earnings Limit */
  UEL = 7,

  /** Directors Primary Threshold (if applicable) */
  DPT = 8,

  /** Investment Zone Upper Secondary Threshold */
  IZUST = 9,
}

/**
 * Extension methods for instances of {@link NiThresholdType}.
 */
export class NationalInsuranceThresholdExtensions {
  /**
   * Gets the zero-based index of the supplied {@link NiThresholdType}. Used when retrieving thresholds from arrays or lists
   * whose elements are ordered the same as this enum.
   * @param threshold {@link NiThresholdType} value.
   * @returns Zero-based index of this NiThresholdType.
   */
  static getIndex(threshold: NiThresholdType): number {
    return threshold;
  }

  /**
   * Gets the full name of the threshold as a string.
   * @param thresholdType {@link NiThresholdType} value.
   * @returns Full name of the threshold as a string, e.g., "Lower Earnings Limit".
   * @throws {Error} Thrown if the NiThresholdType value supplied is unrecognised.
   */
  static getFullName(thresholdType: NiThresholdType): string {
    switch (thresholdType) {
      case NiThresholdType.LEL:
        return "Lower Earnings Limit";
      case NiThresholdType.PT:
        return "Primary Threshold";
      case NiThresholdType.ST:
        return "Secondary Threshold";
      case NiThresholdType.FUST:
        return "Freeport Upper Secondary Threshold";
      case NiThresholdType.UST:
        return "Upper Secondary Threshold";
      case NiThresholdType.AUST:
        return "Apprentice Upper Secondary Threshold";
      case NiThresholdType.VUST:
        return "Veterans Upper Secondary Threshold";
      case NiThresholdType.UEL:
        return "Upper Earnings Limit";
      case NiThresholdType.DPT:
        return "Directors Primary Threshold";
      case NiThresholdType.IZUST:
        return "Investment Zone Upper Secondary Threshold";
      default:
        throw new Error("Unrecognised NiThresholdType value");
    }
  }
}
