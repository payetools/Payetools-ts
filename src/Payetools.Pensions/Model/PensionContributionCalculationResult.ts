// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { IPensionContributionCalculationResult } from "./IPensionContributionCalculationResult";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";
import Big from "big.js";

/**
 * Represents a pension contribution calculation result.
 */
export class PensionContributionCalculationResult
  implements IPensionContributionCalculationResult
{
  /**
   * Gets an empty PensionContributionCalculationResult that indicates that no pension is applicable.
   */
  public static get noPensionApplicable(): IPensionContributionCalculationResult {
    return new PensionContributionCalculationResult();
  }

  /**
   * Gets the pensionable salary for the period.
   */
  public pensionableSalaryInPeriod: Money = zeroGbp;

  /**
   * Gets the earnings basis for the pension calculation (e.g., Qualifying Earnings).
   */
  public earningsBasis: PensionsEarningsBasis =
    PensionsEarningsBasis.Unspecified;

  /**
   * Gets the employee contribution percentage, expressed in percentage points, i.e., 5% = 5.0m.
   */
  public employeeContributionPercentage?: Big;

  /**
   * Gets the employee's fixed contribution amount, if applicable.  If supplied, overrides
   * employeeContributionPercentage.
   */
  public employeeContributionFixedAmount?: Money;

  /**
   * Gets the employer contribution percentage, expressed in percentage points, i.e., 3% = 3.0m.
   */
  public employerContributionPercentage: Big = Big(0);

  /**
   * Gets a value indicating whether salary exchange has been applied.
   */
  public salaryExchangeApplied: boolean = false;

  /**
   * Gets the percentage of employer's NI saving to be re-invested into the employee's pension as an employer-only
   * contribution, expressed in percentage points, i.e., 50% = 50.0m.  Only applies under salary exchange.
   */
  public employersNiReinvestmentPercentage?: Big;

  /**
   * Gets the amount of any employer NI savings that are to be re-invested in the employee's pension, adjusted
   * by the value of employersNiReinvestmentPercentage.  Only applies under salary exchange.
   */
  public employerNiSavingsToReinvest?: Money;

  /**
   * Gets the portion of the total employer-only contribution made under salary exchange that pertains to the
   * employer's contribution.
   */
  public employerContributionAmountBeforeSalaryExchange?: Money;

  /**
   * Gets the amount the employee's gross salary exchanged under a salary exchange arrangement.
   */
  public salaryExchangedAmount?: Money;

  /**
   * Gets any Additional Voluntary Contribution (AVC) made by the employee.
   */
  public employeeAvcAmount?: Money;

  /**
   * Gets the portion of earnings used to calculate the employee and employer contributions under
   * Qualifying Earnings.  Null for pensionable pay.
   */
  public bandedEarnings?: Money;

  /**
   * Gets the pension tax treatment to be applied, i.e., relief at source vs net pay arrangement.
   */
  public taxTreatment: PensionTaxTreatment = PensionTaxTreatment.Unspecified;

  /**
   * Gets the employee contribution amount resulting from the calculation.  Will be zero if salaryExchangeApplied
   * is true.
   */
  public calculatedEmployeeContributionAmount: Money = zeroGbp;

  /**
   * Gets the employer contribution amount resulting from the calculation.  If salaryExchangeApplied is true,
   * includes both calculated amounts for employer and employee contributions and any NI reinvestment to be
   * applied (based on the value of employersNiReinvestmentPercentage).
   */
  public calculatedEmployerContributionAmount: Money = zeroGbp;

  constructor(init?: Partial<PensionContributionCalculationResult>) {
    Object.assign(this, init);
  }
  getEmployeeContributionsUnderNpa(): Money {
    throw new Error("Method not implemented.");
  }
  getEmployeeContributionsOutsideNpa(): Money {
    throw new Error("Method not implemented.");
  }
}
