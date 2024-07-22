// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IPensionContributionLevels } from "~/Payetools.Pensions/Model/IPensionContributionLevels";

/**
 * Defines the levels to be applied for contributions into an employee's pension.
 */
export class PensionContributionLevels implements IPensionContributionLevels {
  /**
   * Gets the employee contribution level, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by the following parameter.
   */
  public employeeContribution: Big;

  /**
   * Gets a value indicating whether `employeeContribution` should be treated as a fixed amount.  True if the employee
   * contribution figure should be treated as a fixed amount; false if it should be treated as a percentage.
   */
  public employeeContributionIsFixedAmount: boolean;

  /**
   * Gets the employer contribution percentage, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by `employerContributionIsFixedAmount`.
   */
  public employerContribution: Big;

  /**
   * Gets a value indicating whether `employerContribution` should be treated as a fixed amount.  True if the employer
   * contribution figure should be treated as a fixed amount; false if it should be treated as a percentage.
   */
  public employerContributionIsFixedAmount: boolean;

  /**
   * Gets a value indicating whether salary exchange should be applied.
   */
  public salaryExchangeApplied: boolean;

  /**
   * Gets the percentage of employer's NI saving to be re-invested into the employee's pension as an employer-only
   * contribution, expressed in percentage points, i.e., 50% = 50.0.  Only applies under salary exchange.
   */
  public employersNiReinvestmentPercentage?: Big;

  /**
   * Gets any Additional Voluntary Contribution (AVC) on the part of the employee.
   */
  public avcForPeriod?: Money;

  /**
   * Gets the value used to override the employer contribution when an individual is on maternity leave
   * and should be paid employer contributions based on their contracted salary rather than their
   * pensionable pay.
   */
  public salaryForMaternityPurposes?: Money;

  constructor(
    employerContribution: Big,
    employerContributionIsFixedAmount: boolean,
    employeeContribution: Big,
    employeeContributionIsFixedAmount: boolean,
    salaryExchangeApplied: boolean = false,
    employersNiReinvestmentPercentage?: Big,
    avcForPeriod?: Money,
    salaryForMaternityPurposes?: Money,
  ) {
    this.employerContribution = employerContribution;
    this.employerContributionIsFixedAmount = employerContributionIsFixedAmount;
    this.employeeContribution = employeeContribution;
    this.employeeContributionIsFixedAmount = employeeContributionIsFixedAmount;
    this.salaryExchangeApplied = salaryExchangeApplied;
    this.employersNiReinvestmentPercentage = employersNiReinvestmentPercentage;
    this.avcForPeriod = avcForPeriod;
    this.salaryForMaternityPurposes = salaryForMaternityPurposes;
  }
}
