// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";

/**
 * Interface that defines the levels to be applied for contributions into an employee's pension.
 */
export interface IPensionContributionLevels {
  /**
   * Gets the employee contribution level, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by `employeeContributionIsFixedAmount`.
   */
  employeeContribution: Big;

  /**
   * Gets a value indicating whether `employeeContribution` should be treated as a fixed amount. True if the employee
   * contribution figure should be treated as a fixed amount; false if it should be treated as a percentage.
   */
  employeeContributionIsFixedAmount: boolean;

  /**
   * Gets the employer contribution percentage, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by `employerContributionIsFixedAmount`.
   */
  employerContribution: Big;

  /**
   * Gets a value indicating whether `employerContribution` should be treated as a fixed amount. True if the employer
   * contribution figure should be treated as a fixed amount; false if it should be treated as a percentage.
   */
  employerContributionIsFixedAmount: boolean;

  /**
   * Gets a value indicating whether salary exchange should be applied.
   */
  salaryExchangeApplied: boolean;

  /**
   * Gets the percentage of employer's NI saving to be re-invested into the employee's pension as an employer-only
   * contribution, expressed in percentage points, i.e., 50% = 50.0. Only applies under salary exchange.
   */
  employersNiReinvestmentPercentage?: Big;

  /**
   * Gets any Additional Voluntary Contribution (AVC) on the part of the employee.
   */
  avcForPeriod?: Money;

  /**
   * Gets the value used to override the employer contribution when an individual is on maternity leave
   * and should be paid employer contributions based on their contracted salary rather than their
   * pensionable pay.
   */
  salaryForMaternityPurposes?: Money;
}
