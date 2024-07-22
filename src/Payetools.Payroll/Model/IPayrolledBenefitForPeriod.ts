// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IPayrolledBenefit } from "./IPayrolledBenefit";

/**
 * Interface that represents the effect of a payrolled on a given pay reference period.
 */
export interface IPayrolledBenefitForPeriod extends IPayrolledBenefit {
  /**
   * Gets the amount of benefit to apply for the period.
   */
  amountForPeriod: Money;
}
