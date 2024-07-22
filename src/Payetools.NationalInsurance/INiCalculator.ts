// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { DirectorsNiCalculationMethod } from "./Model/DirectorsNiCalculationMethod";
import { INiCalculationResult } from "./Model/INiCalculationResult";
import { Money } from "@dintero/money";

/**
 * Interface for types that provide National Insurance calculations.
 */
export interface INiCalculator {
  /**
   * Calculates the National Insurance contributions required for an employee for a given pay period,
   * based on their NI-able salary and their allocated National Insurance category letter.
   *
   * @param niCategory National Insurance category.
   * @param nicableEarningsInPeriod NI-able salary for the period.
   * @param result The NI contributions due via an instance of a type that implements INiCalculationResult.
   */
  calculate(
    niCategory: NiCategory,
    nicableEarningsInPeriod: Money,
  ): INiCalculationResult;

  /**
   * Calculates the National Insurance contributions required for a company director for a given pay period,
   * based on their NI-able salary and their allocated National Insurance category letter.
   *
   * @param calculationMethod Calculation method to use.
   * @param niCategory National Insurance category.
   * @param nicableEarningsInPeriod Ni-able earnings in this period.
   * @param nicableEarningsYearToDate NI-able salary to date.
   * @param employeesNiPaidYearToDate Total employees NI paid so far this tax year up to and including the end of the previous period.
   * @param employersNiPaidYearToDate Total employers NI paid so far this tax year up to and including the end of the previous period.
   * @param proRataFactor Factor to apply to annual thresholds when the employee starts being a director part way through the tax year. Null if not applicable.
   * @param result The NI contributions due via an instance of a type that implements INiCalculationResult.
   */
  calculateDirectors(
    calculationMethod: DirectorsNiCalculationMethod,
    niCategory: NiCategory,
    nicableEarningsInPeriod: Money,
    nicableEarningsYearToDate: Money,
    employeesNiPaidYearToDate: Money,
    employersNiPaidYearToDate: Money,
    proRataFactor?: Big,
  ): INiCalculationResult;
}
