// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { StudentLoanType } from "~/Payetools.Common/Model/StudentLoanType";
import { IStudentLoanCalculationResult } from "./Model/IStudentLoanCalculationResult";
import { IStudentLoanRateSet } from "./ReferenceData/IStudentLoanRateSet";
import { IStudentLoanThresholdSet } from "./ReferenceData/IStudentLoanThresholdSet";
import { Money } from "@dintero/money";
import { IStudentLoanCalculator } from "./IStudentLoanCalculator";
import { StudentLoanCalculationResult } from "./Model/StudentLoanCalculationResult";
import { RoundDown, gbp, zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents a student loan calculator that implements IStudentLoanCalculator.
 */
export class StudentLoanCalculator implements IStudentLoanCalculator {
  private readonly thresholds: IStudentLoanThresholdSet;
  private readonly rates: IStudentLoanRateSet;

  /**
   * Initialises a new instance of a StudentLoanCalculator with the supplied thresholds and rates. Note that
   * supplied thresholds have been adjusted to correspond to the appropriate pay frequency for this calculator instance.
   * @param thresholds Thresholds adjusted to match pay frequency for this calculator.
   * @param rates Student and post-grad loan deduction rates.
   */
  constructor(
    thresholds: IStudentLoanThresholdSet,
    rates: IStudentLoanRateSet,
  ) {
    this.thresholds = thresholds;
    this.rates = rates;
  }

  /**
   * Calculates the necessary student loan deduction based on the input salary, the student loan type (if applicable) and
   * indication of whether to apply post-graduate loan deductions.
   * @param grossSalary Gross salary.
   * @param studentLoanType Optional student loan type. Null if no student loan applies.
   * @param hasPostGradLoan True if post-graduate loan deductions should be applied; false otherwise.
   * @param result An implementation of IStudentLoanCalculationResult containing the results of the calculation.
   */
  calculate(
    grossSalary: Money,
    studentLoanType: StudentLoanType | null,
    hasPostGradLoan: boolean,
  ): IStudentLoanCalculationResult {
    if (studentLoanType == null && !hasPostGradLoan) {
      throw new Error(
        "Student loan calculations can only be performed when a student and/or post-graduate loan is in place",
      );
    }

    let studentLoanThreshold: Money | null = null;
    let studentLoanDeduction = zeroGbp;
    let postGradLoanDeduction = zeroGbp;

    if (studentLoanType != null) {
      studentLoanThreshold = (() => {
        switch (studentLoanType) {
          case StudentLoanType.Plan1:
            return this.thresholds.plan1PerPeriodThreshold;
          case StudentLoanType.Plan2:
            return this.thresholds.plan2PerPeriodThreshold;
          case StudentLoanType.Plan4:
            return this.thresholds.plan4PerPeriodThreshold;
          default:
            throw new Error(
              `Unrecognised value for student loan type: ${studentLoanType}`,
            );
        }
      })();

      if (grossSalary.greaterThan(studentLoanThreshold)) {
        studentLoanDeduction = gbp(
          grossSalary
            .subtract(studentLoanThreshold)
            .amount()
            .mul(this.rates.student)
            .round(0, RoundDown),
        );
      }
    }

    if (
      hasPostGradLoan &&
      grossSalary.greaterThan(this.thresholds.postGradPerPeriodThreshold)
    ) {
      postGradLoanDeduction = gbp(
        grossSalary
          .subtract(this.thresholds.postGradPerPeriodThreshold)
          .amount()
          .mul(this.rates.postGrad)
          .round(0, RoundDown),
      );
    }

    return new StudentLoanCalculationResult(
      studentLoanType ?? undefined,
      hasPostGradLoan,
      studentLoanThreshold ?? undefined,
      hasPostGradLoan ? this.thresholds.postGradPerPeriodThreshold : undefined,
      studentLoanDeduction,
      postGradLoanDeduction,
      studentLoanDeduction.add(postGradLoanDeduction),
    );
  }
}
