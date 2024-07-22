// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { INiCalculator } from "./INiCalculator";
import { DirectorsNiCalculationMethod } from "./Model/DirectorsNiCalculationMethod";
import { INiCalculationResult } from "./Model/INiCalculationResult";
import { NiEarningsBreakdown } from "./Model/NiEarningsBreakdown";
import { NiThresholdType } from "./Model/NiThresholdType";
import { INiPeriodThresholdSet } from "./ReferenceData/INiPeriodThresholdSet";
import { INiThresholdSet } from "./ReferenceData/INiThresholdSet";
import { INiCategoryRatesEntry } from "./ReferenceData/INiCategoryRatesEntry";
import { Money } from "@dintero/money";
import { DecimalNiRoundingExtensions } from "./Extensions/DecimalNiRoundingExtensions";
import { NiCalculationResult } from "./Model/NiCalculationResult";
import { NiThresholdSet } from "./ReferenceData/NiThresholdSet";
import { RoundDown, gbp, zeroGbp } from "~/CurrencyHelpers";
import Big from "big.js";

export class NiCalculator implements INiCalculator {
  // Step constants to assist readability of the code
  private readonly Step1 = 0;
  private readonly Step2 = 1;
  private readonly Step3 = 2;
  private readonly Step4 = 3;
  private readonly Step5 = 4;
  private readonly Step6 = 5;

  private readonly _niRateEntriesForRegularEmployees: ReadonlyMap<
    NiCategory,
    INiCategoryRatesEntry
  >;
  private readonly _niRateEntriesForDirectors: ReadonlyMap<
    NiCategory,
    INiCategoryRatesEntry
  >;
  private readonly _niAnnualThresholds: INiThresholdSet;
  private readonly _niPeriodThresholds: INiPeriodThresholdSet;
  private readonly _isLastPayPeriodInTaxYear: boolean;

  private static readonly _thresholdPairs: [
    NiThresholdType,
    NiThresholdType,
  ][] = [
    [NiThresholdType.LEL, NiThresholdType.ST],
    [NiThresholdType.ST, NiThresholdType.PT],
    [NiThresholdType.PT, NiThresholdType.FUST],
    [NiThresholdType.FUST, NiThresholdType.UEL],
  ];
  private static readonly _directorThresholdPairs: [
    NiThresholdType,
    NiThresholdType,
  ][] = [
    [NiThresholdType.LEL, NiThresholdType.ST],
    [NiThresholdType.ST, NiThresholdType.DPT],
    [NiThresholdType.DPT, NiThresholdType.FUST],
    [NiThresholdType.FUST, NiThresholdType.UEL],
  ];

  private static readonly CalculationStepCount = 6;

  /**
   * Initialises a new `NiCalculator` with the supplied thresholds and rates for the period.
   * @param niAnnualThresholds NI threshold set for the full tax year applicable to this NI calculator.
   * @param niPeriodThresholds NI threshold set for the tax period applicable to this NI calculator.
   * @param niRateEntriesForRegularEmployees NI rates for the tax period applicable to non-directors for this NI calculator.
   * @param niDirectorsRateEntries NI rates for the tax period applicable to directors for this NI calculator.
   * @param isLastPayPeriodInTaxYear Flag indicating whether this calculator is being used to calculate NI
   * for the last pay period of the tax year, which is required for directors' NI.  Optional, defaulted to false.
   */
  constructor(
    niAnnualThresholds: INiThresholdSet,
    niPeriodThresholds: INiPeriodThresholdSet,
    niRateEntriesForRegularEmployees: ReadonlyMap<
      NiCategory,
      INiCategoryRatesEntry
    >,
    niDirectorsRateEntries: ReadonlyMap<NiCategory, INiCategoryRatesEntry>,
    isLastPayPeriodInTaxYear = false,
  ) {
    this._niAnnualThresholds = niAnnualThresholds;
    this._niPeriodThresholds = niPeriodThresholds;
    this._niRateEntriesForRegularEmployees = niRateEntriesForRegularEmployees;
    this._niRateEntriesForDirectors = niDirectorsRateEntries;
    this._isLastPayPeriodInTaxYear = isLastPayPeriodInTaxYear;
  }

  /**
   * Calculates the National Insurance contributions required for an employee for a given pay period,
   * based on their NI-able salary and their allocated National Insurance category letter.
   * @param niCategory National Insurance category.
   * @param nicableEarningsInPeriod NI-able salary for the period.
   * @returns The NI contributions due via an instance of a type that implements `INiCalculationResult`.
   */
  public calculate(
    niCategory: NiCategory,
    nicableEarningsInPeriod: Money,
  ): INiCalculationResult {
    return this.calculateInternal(niCategory, nicableEarningsInPeriod, false);
  }

  /**
   * Calculates the National Insurance contributions required for a company director for a given pay period,
   * based on their NI-able salary and their allocated National Insurance category letter.
   * @param calculationMethod Calculation method to use.
   * @param niCategory National Insurance category.
   * @param nicableEarningsInPeriod Ni-able earnings in this period.
   * @param nicableEarningsYearToDate NI-able salary for the period.
   * @param employeesNiPaidYearToDate Total employees NI paid so far this tax year up to and including the end of the
   * previous period.
   * @param employersNiPaidYearToDate Total employers NI paid so far this tax year up to and including the end of the
   * previous period.
   * @param proRataFactor Factor to apply to annual thresholds when the employee starts being a director part way through
   * the tax year.  Null if not applicable.
   * @returns The NI contributions due via an instance of a type that implements `INiCalculationResult`.
   */
  public calculateDirectors(
    calculationMethod: DirectorsNiCalculationMethod,
    niCategory: NiCategory,
    nicableEarningsInPeriod: Money,
    nicableEarningsYearToDate: Money,
    employeesNiPaidYearToDate: Money,
    employersNiPaidYearToDate: Money,
    proRataFactor?: Big,
  ): INiCalculationResult {
    if (
      calculationMethod === DirectorsNiCalculationMethod.AlternativeMethod &&
      !this._isLastPayPeriodInTaxYear
    ) {
      return this.calculateInternal(niCategory, nicableEarningsInPeriod, false);
    }

    const results: Big[] = new Array<Big>(
      NiCalculator.CalculationStepCount,
    ).fill(Big(0));

    let thresholds: INiThresholdSet;
    const totalNicableEarnings = nicableEarningsYearToDate.add(
      nicableEarningsInPeriod,
    );

    if (proRataFactor == null) {
      thresholds = this._niAnnualThresholds;
    } else {
      thresholds = this.getProRataAnnualThresholds(proRataFactor);
    }

    // Step 1: Earnings up to and including LEL. If answer is negative no NICs due and no recording required. If answer is zero
    // or positive record result and proceed to Step 2.

    const threshold = thresholds.getThreshold(NiThresholdType.LEL);
    const resultOfStep1 = totalNicableEarnings.subtract(threshold);

    if (resultOfStep1.lessThan(zeroGbp)) {
      return NiCalculationResult.noRecordingRequiredResult(
        niCategory,
        nicableEarningsInPeriod,
        thresholds,
      );
    }

    results[this.Step1] = threshold.amount();

    // Step 2: Earnings above LEL up to and including ST. If answer is zero (or negative) no NICs due and the payroll record
    // should be zero filled. If answer is positive enter on the payroll record and proceed to Step 3.
    // Step 3: Earnings above ST up to and including PT. If answer is zero (or negative) no NICs due and the payroll record
    // should be zero filled. If answer is positive enter on the payroll record and proceed to Step 4.
    // Step 4: Earnings above PT up to and including FUST. If answer is zero (or negative) enter result of calculation
    // of Step 3 on the payroll record. If answer is positive enter result of Step 3 on the payroll record and proceed to Step 5.
    // Step 5: Earnings above FUST up to and including UEL. If answer is zero (or negative) enter result of calculation
    // of Step 4 on the payroll record. If answer is positive enter result of Step 4 on the payroll record and proceed to Step 6.

    let previousEarningsAboveThreshold = resultOfStep1;

    for (
      let stepIndex = 0;
      stepIndex < NiCalculator._directorThresholdPairs.length;
      stepIndex++
    ) {
      const upperThreshold = thresholds.getThreshold(
        NiCalculator._directorThresholdPairs[stepIndex][1],
      );

      const earningsAboveUpperThreshold = totalNicableEarnings
        .subtract(upperThreshold)
        .greaterThan(zeroGbp)
        ? totalNicableEarnings.subtract(upperThreshold)
        : zeroGbp;

      const resultOfStep = previousEarningsAboveThreshold.subtract(
        earningsAboveUpperThreshold,
      );

      if (resultOfStep.equals(zeroGbp)) {
        break;
      }

      results[stepIndex + 1] = resultOfStep.amount().round(4, RoundDown);
      previousEarningsAboveThreshold = earningsAboveUpperThreshold;
    }

    // Step 6: Earnings above UEL. If answer is zero or negative no earnings above UEL.

    results[NiCalculator.CalculationStepCount - 1] = (
      totalNicableEarnings
        .subtract(thresholds.getThreshold(NiThresholdType.UEL))
        .greaterThan(zeroGbp)
        ? totalNicableEarnings.subtract(
            thresholds.getThreshold(NiThresholdType.UEL),
          )
        : zeroGbp
    ).amount();

    // Step 7: Calculate employee NICs
    // Step 8: Calculate employer NICs

    const rates = this._niRateEntriesForDirectors.get(niCategory);

    if (!rates) {
      throw new Error(
        `Unable to obtain director's National Insurance rates for category ${niCategory}`,
      );
    }

    const earningsBreakdown =
      this.getNiEarningsBreakdownFromCalculationResults(results);

    const totalEmployeesNiDue = this.calculateEmployeesNi(rates, results);
    const totalEmployersNiDue = this.calculateEmployersNi(rates, results);

    return new NiCalculationResult(
      niCategory,
      totalNicableEarnings,
      rates,
      thresholds,
      earningsBreakdown,
      totalEmployeesNiDue.subtract(employeesNiPaidYearToDate),
      totalEmployersNiDue.subtract(employersNiPaidYearToDate),
    );
  }

  private calculateInternal(
    niCategory: NiCategory,
    nicableEarningsInPeriod: Money,
    useDirectorsRates: boolean,
  ): INiCalculationResult {
    const results: Big[] = new Array<Big>(
      NiCalculator.CalculationStepCount,
    ).fill(Big(0));

    // Step 1: Earnings up to and including LEL. If answer is negative no NICs due and no recording required. If answer is zero
    // or positive record result and proceed to Step 2.

    const threshold = this._niPeriodThresholds.getThreshold(
      NiThresholdType.LEL,
    );
    const resultOfStep1 = nicableEarningsInPeriod.subtract(threshold);

    if (resultOfStep1.lessThan(zeroGbp)) {
      return NiCalculationResult.noRecordingRequiredResult(
        niCategory,
        nicableEarningsInPeriod,
        this._niPeriodThresholds,
      );
    }

    results[this.Step1] = threshold.amount();

    // Step 2: Earnings above LEL up to and including ST. If answer is zero (or negative) no NICs due and the payroll record
    // should be zero filled. If answer is positive enter on the payroll record and proceed to Step 3.
    // Step 3: Earnings above ST up to and including PT. If answer is zero (or negative) no NICs due and the payroll record
    // should be zero filled. If answer is positive enter on the payroll record and proceed to Step 4.
    // Step 4: Earnings above PT up to and including FUST. If answer is zero (or negative) enter result of calculation
    // of Step 3 on the payroll record. If answer is positive enter result of Step 3 on the payroll record and proceed to Step 5.
    // Step 5: Earnings above FUST up to and including UEL. If answer is zero (or negative) enter result of calculation
    // of Step 4 on the payroll record. If answer is positive enter result of Step 4 on the payroll record and proceed to Step 6.

    let previousEarningsAboveThreshold = resultOfStep1;

    for (
      let stepIndex = 0;
      stepIndex < NiCalculator._thresholdPairs.length;
      stepIndex++
    ) {
      const upperThreshold = this._niPeriodThresholds.getThreshold1(
        NiCalculator._thresholdPairs[stepIndex][1],
      );
      const earningsAboveUpperThreshold = nicableEarningsInPeriod
        .subtract(upperThreshold)
        .greaterThan(zeroGbp)
        ? nicableEarningsInPeriod.subtract(upperThreshold)
        : zeroGbp;

      const resultOfStep = previousEarningsAboveThreshold.subtract(
        earningsAboveUpperThreshold,
      );

      if (resultOfStep.equals(zeroGbp)) {
        break;
      }

      results[stepIndex + 1] = resultOfStep.amount().round(4, RoundDown);
      previousEarningsAboveThreshold = earningsAboveUpperThreshold;
    }

    // Step 6: Earnings above UEL. If answer is zero or negative no earnings above UEL.

    results[NiCalculator.CalculationStepCount - 1] = (
      nicableEarningsInPeriod
        .subtract(this._niPeriodThresholds.getThreshold1(NiThresholdType.UEL))
        .greaterThan(zeroGbp)
        ? nicableEarningsInPeriod.subtract(
            this._niPeriodThresholds.getThreshold1(NiThresholdType.UEL),
          )
        : zeroGbp
    ).amount();

    // Step 7: Calculate employee NICs
    // Step 8: Calculate employer NICs

    const rates = useDirectorsRates
      ? this._niRateEntriesForDirectors.get(niCategory)
      : this._niRateEntriesForRegularEmployees.get(niCategory);

    if (!rates) {
      throw new Error(
        `Unable to obtain National Insurance rates for category ${niCategory}`,
      );
    }

    const earningsBreakdown =
      this.getNiEarningsBreakdownFromCalculationResults(results);

    const totalEmployeesNiDue = this.calculateEmployeesNi(rates, results);
    const totalEmployersNiDue = this.calculateEmployersNi(rates, results);

    return new NiCalculationResult(
      niCategory,
      nicableEarningsInPeriod,
      rates,
      this._niPeriodThresholds,
      earningsBreakdown,
      totalEmployeesNiDue,
      totalEmployersNiDue,
    );
  }

  private getProRataAnnualThresholds(proRataFactor: Big): INiThresholdSet {
    return NiThresholdSet.fromProRata(this._niAnnualThresholds, proRataFactor);
  }

  private calculateEmployeesNi(
    rates: INiCategoryRatesEntry,
    calculationStepResults: Big[],
  ): Money {
    if (calculationStepResults.length !== NiCalculator.CalculationStepCount) {
      throw new Error(
        `Unexpected number of calculation step results; should be ${NiCalculator.CalculationStepCount}, was ${calculationStepResults.length}`,
      );
    }

    return gbp(
      DecimalNiRoundingExtensions.niRound(
        calculationStepResults[this.Step4]
          .add(calculationStepResults[this.Step5])
          .mul(rates.employeeRatePTToUEL ?? Big(0)),
      ).add(
        DecimalNiRoundingExtensions.niRound(
          calculationStepResults[this.Step6].mul(
            rates.employeeRateAboveUEL ?? Big(0),
          ),
        ),
      ),
    );
  }

  private calculateEmployersNi(
    rates: INiCategoryRatesEntry,
    calculationStepResults: Big[],
  ): Money {
    if (calculationStepResults.length !== NiCalculator.CalculationStepCount) {
      throw new Error(
        `Unexpected number of calculation step results; should be ${NiCalculator.CalculationStepCount}, was ${calculationStepResults.length}`,
      );
    }

    // From HMRC documentation: Step 3 plus Step 4 multiplied by employer’s band D % rate(don’t round) = a
    // PLUS
    // Step 5 multiplied by employer’s band E % rate (don’t round) = b
    // a plus b = (round)
    // PLUS
    // Step 6 multiplied by employer’s band F % rate(round).
    return gbp(
      DecimalNiRoundingExtensions.niRound(
        calculationStepResults[this.Step3]
          .add(calculationStepResults[this.Step4])
          .mul(rates.employerRateSTToFUST)
          .add(
            calculationStepResults[this.Step5].mul(rates.employerRateFUSTToUEL),
          ),
      ).add(
        DecimalNiRoundingExtensions.niRound(
          calculationStepResults[this.Step6].mul(rates.employerRateAboveUEL),
        ),
      ),
    );
  }

  private getNiEarningsBreakdownFromCalculationResults(
    calculationStepResults: Big[],
  ): NiEarningsBreakdown {
    if (calculationStepResults.length !== NiCalculator.CalculationStepCount) {
      throw new Error(
        `Unexpected number of calculation step results; should be ${NiCalculator.CalculationStepCount}, was ${calculationStepResults.length}`,
      );
    }

    return new NiEarningsBreakdown(
      gbp(calculationStepResults[this.Step1]),
      gbp(calculationStepResults[this.Step2]),
      gbp(calculationStepResults[this.Step3]),
      gbp(calculationStepResults[this.Step4]),
      gbp(calculationStepResults[this.Step5]),
      gbp(calculationStepResults[this.Step6]),
      gbp(
        calculationStepResults[this.Step3]
          .add(calculationStepResults[this.Step4])
          .add(calculationStepResults[this.Step5]),
      ),
    );
  }
}
