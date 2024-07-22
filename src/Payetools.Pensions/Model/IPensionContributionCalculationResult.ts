// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";

/**
 * Interface for types that model pension contribution calculation results.
 */
export interface IPensionContributionCalculationResult {
  /**
   * Gets the pensionable salary for the period.
   */
  pensionableSalaryInPeriod: Money;

  /**
   * Gets the earnings basis for the pension calculation (e.g., Qualifying Earnings).
   */
  earningsBasis: PensionsEarningsBasis;

  /**
   * Gets the employee contribution percentage, expressed in percentage points, i.e., 5% = 5.0m.
   */
  employeeContributionPercentage?: Big;

  /**
   * Gets the employee's fixed contribution amount, if applicable.  If supplied, overrides
   * `employeeContributionPercentage`.
   */
  employeeContributionFixedAmount?: Money;

  /**
   * Gets the employer contribution percentage, expressed in percentage points, i.e., 3% = 3.0m.
   */
  employerContributionPercentage: Big;

  /**
   * Gets a value indicating whether salary exchange has been applied.
   */
  salaryExchangeApplied: boolean;

  /**
   * Gets the percentage of employer's NI saving to be re-invested into the employee's pension as an employer-only
   * contribution, expressed in percentage points, i.e., 50% = 50.0m.  Only applies under salary exchange.
   */
  employersNiReinvestmentPercentage?: Big;

  /**
   * Gets the amount of any employer NI savings that are to be re-invested in the employee's pension, adjusted
   * by the value of `employersNiReinvestmentPercentage`.  Only applies under salary exchange.
   */
  employerNiSavingsToReinvest?: Money;

  /**
   * Gets the portion of the total employer-only contribution made under salary exchange that pertains to the
   * employer's contribution.
   */
  employerContributionAmountBeforeSalaryExchange?: Money;

  /**
   * Gets the amount the employee's gross salary exchanged under a salary exchange arrangement.
   */
  salaryExchangedAmount?: Money;

  /**
   * Gets any Additional Voluntary Contribution (AVC) made by the employee.
   */
  employeeAvcAmount?: Money;

  /**
   * Gets the portion of earnings used to calculate the employee and employer contributions under
   * Qualifying Earnings.  Null for pensionable pay.
   */
  bandedEarnings?: Money;

  /**
   * Gets the pension tax treatment to be applied, i.e., relief at source vs net pay arrangement.
   */
  taxTreatment: PensionTaxTreatment;

  /**
   * Gets the employee contribution amount resulting from the calculation.  Will be zero if `salaryExchangeApplied`
   * is true.
   */
  calculatedEmployeeContributionAmount: Money;

  /**
   * Gets the employer contribution amount resulting from the calculation.  If `salaryExchangeApplied` is true,
   * includes both calculated amounts for employer and employee contributions and any NI reinvestment to be
   * applied (based on the value of `employersNiReinvestmentPercentage`).
   */
  calculatedEmployerContributionAmount: Money;

  /**
   * Gets any employee contributions made under Net Pay Arrangements.
   * @returns Employee contributions made under Net Pay Arrangements.
   */
  getEmployeeContributionsUnderNpa(): Money;

  /**
   * Gets any employee contributions made outside of Net Pay Arrangements.
   * @returns Employee contributions made outside of Net Pay Arrangements.
   */
  getEmployeeContributionsOutsideNpa(): Money;
}
