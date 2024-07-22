// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";

/**
 * Represents the result of an NMW/NLW evaluation for a particular individual for a particular pay period.
 */
export class NmwEvaluationResult {
  /**
   * Initialises a new instance of NmwEvaluationResult.
   * @param isCompliant True if the pay is compliant with the regulations; false otherwise.
   * @param nmwLevelApplied NMW/NLW level used for compliance checking.
   * @param ageAtStartOfPayPeriod Age at the start of the pay period (in whole years).
   * @param commentary Human-readable commentary on the evaluation.
   */
  constructor(
    public readonly isCompliant: boolean,
    public readonly nmwLevelApplied: Money | null,
    public readonly ageAtStartOfPayPeriod: number,
    public readonly commentary: string,
  ) {}
}
