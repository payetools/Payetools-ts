// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IAttachmentOfEarningsCalculationResult } from "./IAttachmentOfEarningsCalculationResult";

/**
 * Interface for types that provide calculation of attachment of earnings orders.
 */
export interface IAttachmentOfEarningsCalculator {
  /**
   * Calculates the appropriate employee deduction for the attachment of earnings that this calculator
   * pertains to.
   *
   * @param earnings - Earnings.
   * @param result - Result.
   */
  calculate(
    earnings: number,
    result: IAttachmentOfEarningsCalculationResult,
  ): void;
}
