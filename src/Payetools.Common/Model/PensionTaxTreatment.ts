// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/** Enum that represents the tax treatment to be applied to employee pension contributions. */
export enum PensionTaxTreatment {
  /** Not specified. */
  Unspecified = 0,

  /**
   * Relief at source.  Contributions are taken from post-tax salary and the pension
   *  provider claims back basic rate tax from HMRC. */
  ReliefAtSource = 1,

  /** Net pay arrangement.  Contributions are taken from salary before tax. */
  NetPayArrangement = 2,
}
