// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ArgumentException } from "../Diagnostics/ArgumentException";
import { ArgumentOutOfRangeException } from "../Diagnostics/ArgumentOutOfRangeException";
import { CountriesForTaxPurposes } from "./CountriesForTaxPurposes";

/** Enum representing the tax treatment aspect of the tax code. */
export enum TaxTreatment {
  /** Not specified. */
  Unspecified = "Unspecified",

  /** NT - no tax payable. */
  NT = "NT",

  /** BR - basic rate tax to be applied to all taxable earnings. */
  BR = "BR",

  /** D0 - next highest rate above BR to be applied to all taxable earnings. */
  D0 = "D0",

  /** D1 - next highest rate above D0 to be applied to all taxable earnings. */
  D1 = "D1",

  /** D2 - next highest rate above D1 to be applied to all taxable earnings. */
  D2 = "D2",

  /** Zero personal allowance to be applied. */
  _0T = "_0T",

  /** Additional notional taxable income must be applied to existing taxable earnings. */
  K = "K",

  /** Tax payer is entitled to the standard Personal Allowance. */
  L = "L",

  /** Married Allowance where individual has received a transfer of 10% of their partner’s Personal Allowance. */
  M = "M",

  /** Married Allowance where individual has transferred 10% of their Personal Allowance to their partner. */
  N = "N",
}

/** Extension methods for TaxTreatment. */
export class TaxTreatmentExtensions {
  /** Gets the zero-based index of the band that a given tax code (BR, D0, D1, D2) applies to. */
  static getBandIndex(
    taxTreatment: TaxTreatment,
    applicableCountries: CountriesForTaxPurposes,
  ): number {
    switch (taxTreatment) {
      case TaxTreatment.BR:
        return applicableCountries === CountriesForTaxPurposes.Scotland ? 1 : 0;
      case TaxTreatment.D0:
        return applicableCountries === CountriesForTaxPurposes.Scotland ? 2 : 1;
      case TaxTreatment.D1:
        return applicableCountries === CountriesForTaxPurposes.Scotland ? 3 : 2;
      case TaxTreatment.D2:
        if (applicableCountries === CountriesForTaxPurposes.Scotland) {
          return 4;
        } else {
          throw new ArgumentOutOfRangeException(
            "taxTreatment",
            "Invalid tax treatment for applicable tax regime",
          );
        }
      default:
        throw new ArgumentException(
          `Band index not valid for tax treatment ${taxTreatment}`,
          "taxTreatment",
        );
    }
  }
}
