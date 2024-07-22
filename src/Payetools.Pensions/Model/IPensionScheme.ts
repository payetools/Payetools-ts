// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";

/**
 * Interface for types that represent pension schemes.
 *
 * A `IPensionScheme` instance refers to a pension scheme with a specific provider, with
 * specific tax treatment and earnings basis. Whilst it is not common for pension schemes to change
 * tax treatment, it is quite possible for an employer to operate more than one type of earnings basis
 * across its employee base. In this case, two (or more) instances of this type would be required, one
 * for each earnings basis in use, even though all contributions might be flowing to a single scheme
 * with the same provider.
 */
export interface IPensionScheme {
  /**
   * Gets the earnings basis for this pension scheme.
   */
  earningsBasis: PensionsEarningsBasis;

  /**
   * Gets the tax treatment for this pension scheme.
   */
  taxTreatment: PensionTaxTreatment;
}
