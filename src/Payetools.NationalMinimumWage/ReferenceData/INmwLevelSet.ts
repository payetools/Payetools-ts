// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";

/**
 * Interface for types that detail the various HMRC-published National Minimum/Living Wage (NMW/NLW) levels.
 */
export interface INmwLevelSet {
  /**
   * Gets the NMW level for apprentices under 19 or apprentices aged 19 and over in the first year of their
   * apprenticeship.
   */
  apprenticeLevel: Money;

  /**
   * Gets the NMW level for employees under the age of 18 (but over the school leaving age).
   */
  under18Level: Money;

  /**
   * Gets the NMW level for employees aged between 18 and 20.
   */
  age18To20Level: Money;

  /**
   * Gets the NMW level for employees aged between 21 and 22.
   */
  age21To22Level: Money;

  /**
   * Gets the NLW (rather than NMW) level for employees aged 23 and over.
   */
  age23AndAboveLevel: Money;
}
