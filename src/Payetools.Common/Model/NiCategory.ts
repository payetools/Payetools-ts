// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYearEnding } from "./TaxYearEnding";

/**
 * Represents the set of National Insurance category letters assigned by HMRC.  Taken from
 * https://www.gov.uk/national-insurance-rates-letters/category-letters (retrieved 5-Dec-2022).
 */
export enum NiCategory {
  /** Not specified. */
  Unspecified,

  /** All employees apart from those in groups B, C, H, J, M, V and Z, and those that work in
   * freeports (F, I, L and S) and those that are exempt (X). */
  A,

  /** Married women and widows entitled to pay reduced National Insurance. */
  B,

  /** Employees over the State Pension age. */
  C,

  /** Investment Zone — deferment.  Added for 2024-2025. */
  D,

  /** Investment Zone — married women and widows reduced rate.  Added for 2024-2025. */
  E,

  /** All employees who work in freeports, apart from those in categories I, L, and S. */
  F,

  /** Apprentices under 25. */
  H,

  /** Married women and widows who work in freeports and are entitled to pay reduced National Insurance. */
  I,

  /** Employees who can defer National Insurance because they’re already paying it in another job. */
  J,

  /** Investment Zone — state pensioner.  Added for 2024-2025. */
  K,

  /** Employees who work in freeports and can defer National Insurance because they’re already paying it in another job. */
  L,

  /** Employees under 21. */
  M,

  /** Investment Zone.  Added for 2024-2025. */
  N,

  /** Employees who work in freeports and are over the State Pension age. */
  S,

  /** Employees who are working in their first job since leaving the armed forces (veterans). */
  V,

  /** Employees who do not have to pay National Insurance, for example because they’re under 16. */
  X,

  /** Employees under 21 who can defer National Insurance because they’re already paying it in another job. */
  Z,
}

/**
 * Extension methods related to NiCategory.
 */
export class NiCategoryRelatedExtensions {
  /**
   * Converts the supplied string into an NiCategory value based on the
   * specified tax year.  (Not all NI letters are valid for all tax years.)
   * @param value String value to convert.  May be null.
   * @param taxYearEnding Tax year ending that pertains to this conversion.
   * @returns NI category value that corresponds to the supplied string.
   * @throws {Error} Thrown if the supplied value cannot be converted
   * to a valid NI category for the specified tax year.
   */
  public static toNiCategory(
    value: string | null,
    taxYearEnding: TaxYearEnding,
  ): NiCategory | null {
    if (value == null) return null;

    const category = NiCategory[value as keyof typeof NiCategory];
    if (category == null) {
      throw new Error(`Value '${value}' is not a valid NiCategory value`);
    }

    if (taxYearEnding < TaxYearEnding.Apr5_2025) {
      if (
        category === NiCategory.D ||
        category === NiCategory.E ||
        category === NiCategory.K ||
        category === NiCategory.N
      ) {
        throw new Error(
          "NI Categories D, E, K and N are not valid NI categories prior to tax year ending 5 April 2025",
        );
      }
    }

    return category;
  }
}
