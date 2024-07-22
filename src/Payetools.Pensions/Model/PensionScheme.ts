// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";

/**
 * Represents a workplace pension scheme.
 */
export interface PensionScheme {
  /**
   * Gets the earnings basis for this pension scheme.
   */
  earningsBasis: PensionsEarningsBasis;

  /**
   * Gets the tax treatment for this pension scheme.
   */
  taxTreatment: PensionTaxTreatment;
}
