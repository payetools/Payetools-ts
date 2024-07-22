// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IPayrolledBenefitForPeriod } from "./IPayrolledBenefitForPeriod";

// import { IPayrolledBenefitForPeriod } from './IPayrolledBenefitForPeriod';

/**
 * Represents a payrolled benefit as applicable to one payroll period.
 */
export class PayrolledBenefitForPeriod implements IPayrolledBenefitForPeriod {
  /**
   * Gets the amount of benefit to apply for the period.
   */
  public amountForPeriod: Money;

  /**
   * Initialises a new instance of `PayrolledBenefitForPeriod`.
   * @param amountForPeriod Amount of the benefit for the period.
   */
  constructor(amountForPeriod: Money) {
    this.amountForPeriod = amountForPeriod;
  }
}
