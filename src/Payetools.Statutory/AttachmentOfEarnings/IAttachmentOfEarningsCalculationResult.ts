// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";

/**
 * Interface that represents the results of an attachment of earnings calculation.
 */
export interface IAttachmentOfEarningsCalculationResult {
  /**
   * Gets the total deduction applicable as a result of any attachment of earnings orders.
   */
  totalDeduction: Money;
}
