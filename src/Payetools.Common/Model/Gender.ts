// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Enum representing a person's gender. Note that HMRC only recognises the genders male and female for PAYE purposes, hence
 * only two options (plus unknown) are provided.
 */
export enum Gender {
  /** Not known/undefined */
  Unknown,

  /** Male */
  Male,

  /** Female */
  Female,
}
