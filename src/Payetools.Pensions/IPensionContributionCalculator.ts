// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IPensionContributionCalculationResult } from "./Model/IPensionContributionCalculationResult";

/**
 * Interface for types that provide calculation of pension contributions, both under normal arrangements
 * and under salary exchange (aka salary sacrifice).
 */
export interface IPensionContributionCalculator {
  /**
   * Calculates the appropriate employee and employer pension contributions based on the supplied employer
   * and employee rates. Also supports the ability to supply a fixed employee contribution as an
   * alternative to an employee percentage rate.
   *
   * @param pensionableSalary - Pensionable salary to be used for calculation.
   * @param employerContribution - Employer contribution level, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by `employerContributionIsFixedAmount`.
   * @param employerContributionIsFixedAmount - True if the `employerContribution` parameter should be treated as a
   * fixed amount; false if it should be treated as a percentage.
   * @param employeeContribution - Employee contribution level, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by the following parameter.
   * @param employeeContributionIsFixedAmount - True if the `employeeContribution` parameter should be treated as
   * a fixed amount; false if it should be treated as a percentage.
   * @param avcForPeriod - Any Additional Voluntary Contribution (AVC) on the part of the employee.
   * @param salaryForMaternityPurposes - Used to override the employer contribution when an individual is on
   * maternity leave and should be paid employer contributions based on their contracted salary rather than their
   * pensionable pay.
   * @param result - An instance of a `IPensionContributionCalculationResult` implementation that contains
   * the results of the calculation.
   */
  calculate(
    pensionableSalary: Money,
    employerContribution: Big,
    employerContributionIsFixedAmount: boolean,
    employeeContribution: Big,
    employeeContributionIsFixedAmount: boolean,
    avcForPeriod: Money | null,
    salaryForMaternityPurposes: Money | null,
  ): IPensionContributionCalculationResult;

  /**
   * Calculates the appropriate employee and employer pension contributions based on the supplied employer
   * and employee rates, but under salary exchange arrangements. Here the output employee contribution will
   * always be zero. Also supports the ability to supply a fixed employee contribution as an
   * alternative to an employee percentage rate.
   *
   * @param pensionableSalary - Pensionable salary to be used for calculation.
   * @param employerContribution - Employer contribution level, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by `employerContributionIsFixedAmount`.
   * @param employerContributionIsFixedAmount - True if the `employerContribution` parameter should be treated as a
   * fixed amount; false if it should be treated as a percentage.
   * @param employerNiSavings - Savings in employer's NI due to the salary exchanged.
   * @param employerNiSavingsReinvestmentPercentage - Percentage of employer NI savings to be reinvested in the employee's
   * pension, expressed in percentage points (i.e., 100% = 100.0).
   * @param employeeSalaryExchanged - The level of employee's salary forgone as set out in the salary
   * exchange arrangements. Expressed either as a percentage in percentage points (e.g., 5% = 5.0), or as a fixed
   * amount, as indicated by the following parameter. NB If fixed amount is given, it relates to the pay period
   * (as opposed to annually).
   * @param employeeSalaryExchangedIsFixedAmount - True if the `employeeContribution` parameter should be treated as
   * a fixed amount; false if it should be treated as a percentage.
   * @param avcForPeriod - Any Additional Voluntary Contribution (AVC) on the part of the employee.
   * @param salaryForMaternityPurposes - Used to override the employer contribution when an individual is on
   * maternity leave and should be paid employer contributions based on their contracted salary rather than their
   * pensionable pay.
   * @param result - An instance of a `IPensionContributionCalculationResult` implementation that contains
   * the results of the calculation.
   */
  calculateUnderSalaryExchange(
    pensionableSalary: Money,
    employerContribution: Big,
    employerContributionIsFixedAmount: boolean,
    employerNiSavings: Money,
    employerNiSavingsReinvestmentPercentage: Big,
    employeeSalaryExchanged: Big,
    employeeSalaryExchangedIsFixedAmount: boolean,
    avcForPeriod?: Money,
    salaryForMaternityPurposes?: Money,
  ): IPensionContributionCalculationResult;

  /**
   * Gets the absolute amount of employee salary exchanged, either as a result of a fixed amount being passed in,
   * or as a percentage of pensionable salary (banded in the case of Qualifying Earnings).
   *
   * @param pensionableSalary - Pensionable salary to be used for calculation.
   * @param employeeSalaryExchanged - The level of employee's salary forgone as set out in the salary
   * exchange arrangements. Expressed either as a percentage in percentage points (e.g., 5% = 5.0), or as a fixed
   * amount, as indicated by the following parameter. NB If fixed amount is given, it relates to the pay period
   * (as opposed to annually).
   * @param employeeSalaryExchangedIsFixedAmount - True if the previous parameter should be treated as a fixed amount; false if
   * it should be treated as a percentage.
   * @returns Value of employee salary being exchanged.
   */
  getSalaryExchangedAmount(
    pensionableSalary: Money,
    employeeSalaryExchanged: Big,
    employeeSalaryExchangedIsFixedAmount: boolean,
  ): Money;
}
