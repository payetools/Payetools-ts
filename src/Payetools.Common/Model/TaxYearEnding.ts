// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Enum representing a given tax year based on the last day of the tax year (i.e., 5 April 20xx).
 * @remarks This enumeration is updated each tax year to provide access to the forthcoming tax year.
 */
export enum TaxYearEnding {
  /** No tax year specified */
  Unspecified,

  /** 2018-2019 */
  Apr5_2019 = 2019,

  /** 2019-2020 */
  Apr5_2020 = 2020,

  /** 2020-2021 */
  Apr5_2021 = 2021,

  /** 2021-2022 */
  Apr5_2022 = 2022,

  /** 2022-2023 */
  Apr5_2023 = 2023,

  /** 2023-2024 */
  Apr5_2024 = 2024,

  /** 2024-2025 */
  Apr5_2025 = 2025,

  /** Minimum value supported for TaxYearEnding */
  MinValue = 2019,

  /** Maximum value supported for TaxYearEnding */
  MaxValue = 2025,
}

/**
 * Extension methods for TaxYearEnding enum.
 */
export class TaxYearEndingExtensions {
  /**
   * Converts a TaxYearEnding enumerated value into a string.
   * @param value An instance of TaxYearEnding.
   * @returns Year as string, e.g., "2020", indicating the year that the tax year ends in.
   */
  public static yearAsString(value: TaxYearEnding): string {
    return `${value.toString().padStart(4, "0")}`;
  }
}
