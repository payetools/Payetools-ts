// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ArgumentException } from "~/Payetools.Common/Diagnostics/ArgumentException";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { IPensionContributionCalculator } from "./IPensionContributionCalculator";
import { IPensionContributionCalculationResult } from "./Model/IPensionContributionCalculationResult";
import { PensionContributionCalculationResult } from "./Model/PensionContributionCalculationResult";
import { Money } from "@dintero/money";
import { RoundUp, gbp, zeroGbp } from "~/CurrencyHelpers";
import Big from "big.js";

/**
 * Abstract class that represents different types of pension contribution calculators.
 */
export abstract class PensionContributionCalculator
  implements IPensionContributionCalculator
{
  private readonly _taxTreatment: PensionTaxTreatment;
  private readonly _basicRateOfTax?: Big;

  /**
   * Gets the earnings basis of this pension contribution calculator i.e., Qualifying Earnings vs Pensionable
   * Pay Set X.
   */
  public abstract get earningsBasis(): PensionsEarningsBasis;

  /**
   * Gets the tax relief factor to apply for relief at source pensions.  For example, if the basic rate of
   * tax is 20%, then the tax relief factor is 0.8.
   */
  protected get TaxReliefFactor(): Big {
    return this._basicRateOfTax != null
      ? Big(1).sub(this._basicRateOfTax)
      : Big(1.0);
  }

  /**
   * Initialises a new instance of PensionContributionCalculator with the supplied tax treatment
   * and optional basic rate of tax (needed for relief at source pensions only).
   * @param taxTreatment Tax treatment i.e., relief at source vs net pay arrangement.
   * @param basicRateOfTax Basic rate of tax to use for relief at source pensions. Optional.
   * @throws ArgumentException Thrown if no basic rate of tax is supplied for a relief at
   * source pension.
   */
  constructor(taxTreatment: PensionTaxTreatment, basicRateOfTax?: Big) {
    this._taxTreatment = taxTreatment;

    if (
      !basicRateOfTax &&
      taxTreatment === PensionTaxTreatment.ReliefAtSource
    ) {
      throw new ArgumentException(
        "Parameter cannot be null for relief at source tax treatment",
        "basicRateOfTax",
      );
    }

    this._basicRateOfTax = basicRateOfTax ?? undefined;
  }

  /**
   * Calculates the appropriate employee and employer pension contributions based on the supplied employer
   * and employee rates.  Also supports the ability to supply a fixed employee contribution as an
   * alternative to an employee percentage rate.
   * @param pensionableSalary Pensionable salary to be used for calculation.
   * @param employerContribution Employer contribution level, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by employerContributionIsFixedAmount.
   * @param employerContributionIsFixedAmount True if the employerContribution parameter should be treated as a
   * fixed amount; false if it should be treated as a percentage.
   * @param employeeContribution Employee contribution level, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by the following parameter.
   * @param employeeContributionIsFixedAmount True if the employeeContribution parameter should be treated as
   * a fixed amount; false if it should be treated as a percentage.
   * @param avcForPeriod Any Additional Voluntary Contribution (AVC) on the part of the employee.
   * @param salaryForMaternityPurposes Used to override the employer contribution when an individual is on
   * maternity leave and should be paid employer contributions based on their contracted salary rather than their
   * pensionable pay.
   * @param result An instance of a IPensionContributionCalculationResult implementation that contains
   * the results of the calculation.
   */
  public calculate(
    pensionableSalary: Money,
    employerContribution: Big,
    employerContributionIsFixedAmount: boolean,
    employeeContribution: Big,
    employeeContributionIsFixedAmount: boolean,
    avcForPeriod: Money | null,
    salaryForMaternityPurposes: Money | null,
  ): IPensionContributionCalculationResult {
    if (employerContributionIsFixedAmount) {
      throw new Error(
        "Only percentage-based employer contributions are supported",
      );
    }

    const adjustedEmployeeContribution = employeeContributionIsFixedAmount
      ? employeeContribution
      : this._taxTreatment === PensionTaxTreatment.ReliefAtSource
        ? employeeContribution.mul(this.TaxReliefFactor)
        : employeeContribution;

    const contributions = this.calculateContributions(
      pensionableSalary,
      employerContribution,
      adjustedEmployeeContribution,
      employeeContributionIsFixedAmount,
      salaryForMaternityPurposes,
    );

    return new PensionContributionCalculationResult({
      bandedEarnings:
        this.earningsBasis === PensionsEarningsBasis.QualifyingEarnings
          ? contributions.earningsForPensionCalculation
          : undefined,
      earningsBasis: this.earningsBasis,
      employeeAvcAmount: avcForPeriod ?? undefined,
      calculatedEmployeeContributionAmount:
        contributions.employeeContribution.add(avcForPeriod ?? zeroGbp),
      employeeContributionFixedAmount: employeeContributionIsFixedAmount
        ? gbp(employeeContribution)
        : undefined,
      employeeContributionPercentage: employeeContributionIsFixedAmount
        ? undefined
        : employeeContribution,
      calculatedEmployerContributionAmount: contributions.employerContribution,
      employerContributionPercentage: employerContribution,
      employersNiReinvestmentPercentage: undefined,
      employerContributionAmountBeforeSalaryExchange: undefined,
      employerNiSavingsToReinvest: undefined,
      pensionableSalaryInPeriod: pensionableSalary,
      salaryExchangeApplied: false,
      salaryExchangedAmount: undefined,
    });
  }

  /**
   * Calculates the appropriate employee and employer pension contributions based on the supplied employer
   * and employee rates, but under salary exchange arrangements.  Here the output employee contribution will
   * always be zero.  Also supports the ability to supply a fixed employee contribution as an
   * alternative to an employee percentage rate.
   * @param pensionableSalary Pensionable salary to be used for calculation.
   * @param employerContribution Employer contribution level, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by employerContributionIsFixedAmount.
   * @param employerContributionIsFixedAmount True if the employerContribution parameter should be treated as a
   * fixed amount; false if it should be treated as a percentage.
   * @param employerNiSavings Savings in employer's NI due to the salary exchanged.
   * @param employerNiSavingsReinvestmentPercentage Percentage of employer NI savings to be reinvested in the employee's
   * pension, expressed in percentage points (i.e., 100% = 100.0).
   * @param employeeSalaryExchanged The level of employee's salary forgone as set out in the salary
   * exchange arrangements.  Expressed either as a percentage in percentage points (e.g., 5% = 5.0), or as a fixed
   * amount, as indicated by the following parameter.  NB If fixed amount is given, it relates to the pay period
   * (as opposed to annually).
   * @param employeeSalaryExchangedIsFixedAmount True if the previous parameter should be treated as a fixed amount; false if
   * it should be treated as a percentage.
   * @param avcForPeriod Any Additional Voluntary Contribution (AVC) on the part of the employee.
   * @param salaryForMaternityPurposes Used to override the employer contribution when an individual is on
   * maternity leave and should be paid employer contributions based on their contracted salary rather than their
   * pensionable pay.
   * @param result An instance of a IPensionContributionCalculationResult implementation that contains
   * the results of the calculation.
   */
  public calculateUnderSalaryExchange(
    pensionableSalary: Money,
    employerContribution: Big,
    employerContributionIsFixedAmount: boolean,
    employerNiSavings: Money,
    employerNiSavingsReinvestmentPercentage: Big,
    employeeSalaryExchanged: Big,
    employeeSalaryExchangedIsFixedAmount: boolean,
    avcForPeriod?: Money,
    salaryForMaternityPurposes?: Money,
  ): IPensionContributionCalculationResult {
    if (employerContributionIsFixedAmount) {
      throw new Error(
        "Only percentage-based employer contributions are supported",
      );
    }

    const contributions = this.calculateContributions(
      pensionableSalary,
      employerContribution,
      employeeSalaryExchanged,
      employeeSalaryExchangedIsFixedAmount,
      salaryForMaternityPurposes ?? null,
    );

    const employerNiSavingsToReinvest = gbp(
      employerNiSavings
        .amount()
        .mul(employerNiSavingsReinvestmentPercentage.div(100.0))
        .round(2, RoundUp),
    );

    return new PensionContributionCalculationResult({
      bandedEarnings:
        this.earningsBasis === PensionsEarningsBasis.QualifyingEarnings
          ? contributions.earningsForPensionCalculation
          : undefined,
      earningsBasis: this.earningsBasis,
      employeeAvcAmount: avcForPeriod,
      calculatedEmployeeContributionAmount: avcForPeriod ?? zeroGbp,
      employeeContributionFixedAmount: employeeSalaryExchangedIsFixedAmount
        ? gbp(employeeSalaryExchanged)
        : undefined,
      employeeContributionPercentage: employeeSalaryExchangedIsFixedAmount
        ? undefined
        : employeeSalaryExchanged,
      calculatedEmployerContributionAmount: contributions.employerContribution
        .add(contributions.employeeContribution)
        .add(employerNiSavingsToReinvest),
      employerContributionPercentage: employerContribution,
      employersNiReinvestmentPercentage:
        employerNiSavingsReinvestmentPercentage,
      employerContributionAmountBeforeSalaryExchange:
        contributions.employerContribution,
      employerNiSavingsToReinvest: employerNiSavingsToReinvest,
      pensionableSalaryInPeriod: pensionableSalary,
      salaryExchangeApplied: true,
      salaryExchangedAmount: contributions.employeeContribution,
    });
  }

  /**
   * Gets the absolute amount of employee salary exchanged, either as a result of a fixed amount being passed in,
   * or as a percentage of pensionable salary (banded in the case of Qualifying Earnings.
   * @param pensionableSalary Pensionable salary to be used for calculation.
   * @param employeeSalaryExchanged The level of employee's salary forgone as set out in the salary
   * exchange arrangements.  Expressed either as a percentage in percentage points (e.g., 5% = 5.0), or as a fixed
   * amount, as indicated by the following parameter.  NB If fixed amount is given, it relates to the pay period
   * (as opposed to annually).
   * @param employeeSalaryExchangedIsFixedAmount True if the previous parameter should be treated as a fixed amount; false if
   * it should be treated as a percentage.
   * @returns Value of employee salary being exchanged.
   */
  public getSalaryExchangedAmount(
    pensionableSalary: Money,
    employeeSalaryExchanged: Big,
    employeeSalaryExchangedIsFixedAmount: boolean,
  ): Money {
    return employeeSalaryExchangedIsFixedAmount
      ? gbp(employeeSalaryExchanged)
      : gbp(
          this.getEarningsForPensionCalculation(pensionableSalary)
            .amount()
            .mul(employeeSalaryExchanged.div(100.0))
            .round(2, RoundUp),
        );
  }

  /**
   * Abstract method signature for calculating pension contributions based on the supplied inputs.
   * @param pensionableSalary Pensionable salary to be used for calculation.
   * @param employerContributionPercentage Employer contribution level, expressed in percentage points (i.e., 3% = 3.0).
   * @param employeeContribution Employee contribution level, either expressed in percentage points (i.e., 5% = 5.0)
   * or as a fixed amount (i.e. £500.00), as indicated by the following parameter.
   * @param employeeContributionIsFixedAmount True if the previous parameter should be treated as a fixed amount; false if
   * it should be treated as a percentage.
   * @param salaryForMaternityPurposes Used to override the employer contribution when an individual is on
   * maternity leave and should be paid employer contributions based on their contracted salary rather than their
   * pensionable pay.
   * @returns A tuple containing the earnings used for the calculation (employee only if maternity override applies),
   * and the employer and employee contribution levels.
   */
  protected abstract calculateContributions(
    pensionableSalary: Money,
    employerContributionPercentage: Big,
    employeeContribution: Big,
    employeeContributionIsFixedAmount: boolean,
    salaryForMaternityPurposes: Money | null,
  ): {
    earningsForPensionCalculation: Money;
    employerContribution: Money;
    employeeContribution: Money;
  };

  /**
   * Gets the earnings to be used for the pensionable salary calculation.  For Pensionable Pay Set X, this is the same
   * as the earnings; for QualifyingEarnings, this is the banded amount.
   * @param pensionableSalary Original pensionable salary.
   * @returns Earnings to be used for the pensionable salary calculation.
   */
  protected abstract getEarningsForPensionCalculation(
    pensionableSalary: Money,
  ): Money;
}
