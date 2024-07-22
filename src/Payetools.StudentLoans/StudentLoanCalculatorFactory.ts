// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { IStudentLoanCalculator } from "./IStudentLoanCalculator";
import { IStudentLoanReferenceDataProvider } from "./ReferenceData/IStudentLoanReferenceDataProvider";
import { IStudentLoanThresholdSet } from "./ReferenceData/IStudentLoanThresholdSet";
import { StudentLoanThresholdSet } from "./ReferenceData/StudentLoanThresholdSet";
import { StudentLoanCalculator } from "./StudentLoanCalculator";
import { PayFrequencyExtensions } from "~/Payetools.Common/Model/PayFrequency";
import { Money } from "@dintero/money";
import { RoundDown, gbp } from "~/CurrencyHelpers";

/**
 * Factory to generate IStudentLoanCalculator implementations that are for a given pay date.
 */
export class StudentLoanCalculatorFactory {
  private referenceDataProvider: IStudentLoanReferenceDataProvider;

  /**
   * Initialises a new instance of StudentLoanCalculator using the supplied reference data provider.
   * @param referenceDataProvider Reference data provider that provides access to HMRC-published
   * thresholds and rates for student loan deductions.
   */
  constructor(referenceDataProvider: IStudentLoanReferenceDataProvider) {
    this.referenceDataProvider = referenceDataProvider;
  }

  /**
   * Gets a new IStudentLoanCalculator based on the specified pay date and number of tax periods. The pay date
   * is provided in order to determine which set of levels to use, noting that these may (but rarely do) change in-year.
   * @param payDate Applicable pay date.
   * @returns A new calculator instance.
   */
  public getCalculator(payDate: PayDate): IStudentLoanCalculator {
    const thresholds = StudentLoanCalculatorFactory.adjustThresholds(
      this.referenceDataProvider.getStudentLoanThresholdsForTaxYearAndPeriod(
        payDate.taxYear,
        payDate.payFrequency,
        payDate.taxPeriod,
      ),
      PayFrequencyExtensions.getStandardTaxPeriodCount(payDate.payFrequency),
    );
    const rates =
      this.referenceDataProvider.getStudentLoanRatesForTaxYearAndPeriod(
        payDate.taxYear,
        payDate.payFrequency,
        payDate.taxPeriod,
      );

    return new StudentLoanCalculator(thresholds, rates);
  }

  private static adjustThresholds(
    thresholds: IStudentLoanThresholdSet,
    payPeriodsInYear: number,
  ): IStudentLoanThresholdSet {
    return new StudentLoanThresholdSet(
      gbp(
        thresholds.plan1PerPeriodThreshold
          .amount()
          .div(payPeriodsInYear)
          .round(2, RoundDown),
      ),
      gbp(
        thresholds.plan2PerPeriodThreshold
          .amount()
          .div(payPeriodsInYear)
          .round(2, RoundDown),
      ),
      gbp(
        thresholds.plan4PerPeriodThreshold
          .amount()
          .div(payPeriodsInYear)
          .round(2, RoundDown),
      ),
      gbp(
        thresholds.postGradPerPeriodThreshold
          .amount()
          .div(payPeriodsInYear)
          .round(2, RoundDown),
      ),
    );
  }
}
