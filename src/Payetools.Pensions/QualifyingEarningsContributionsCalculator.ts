// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionContributionCalculator } from "./PensionContributionCalculator";
import { Money } from "@dintero/money";
import { RoundUp, gbp, zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents a pension contribution calculator for Qualifying Earnings.
 */
export class QualifyingEarningsContributionsCalculator extends PensionContributionCalculator {
  private readonly _lowerLevelForQualifyingEarnings: Money;
  private readonly _upperLevelForQualifyingEarnings: Money;

  /**
   * Gets the earnings basis for this calculator. Always returns `PensionsEarningsBasis.QualifyingEarnings`.
   */
  public get earningsBasis(): PensionsEarningsBasis {
    return PensionsEarningsBasis.QualifyingEarnings;
  }

  /**
   * Initialises a new instance of `QualifyingEarningsContributionsCalculator` with the specified tax treatment,
   * using the lower and upper thresholds supplied.
   * @param taxTreatment Tax treatment for the target pension, i.e., net pay arrangement vs relief at source.
   * @param lowerLevelForQualifyingEarnings HMRC/TPR-supplied lower level for qualifying earnings.
   * @param upperLevelForQualifyingEarnings HMRC/TPR-supplied upper level for qualifying earnings.
   * @param basicRateOfTax Basic rate of tax to use for relief at source pensions.
   */
  constructor(
    taxTreatment: PensionTaxTreatment,
    lowerLevelForQualifyingEarnings: Money,
    upperLevelForQualifyingEarnings: Money,
    basicRateOfTax?: Big,
  ) {
    super(taxTreatment, basicRateOfTax);
    this._lowerLevelForQualifyingEarnings = lowerLevelForQualifyingEarnings;
    this._upperLevelForQualifyingEarnings = upperLevelForQualifyingEarnings;
  }

  /**
   * @inheritdoc
   */
  protected calculateContributions(
    pensionableSalary: Money,
    employerContributionPercentage: Big,
    employeeContribution: Big,
    employeeContributionIsFixedAmount: boolean,
    salaryForMaternityPurposes: Money | null,
  ): {
    earningsForPensionCalculation: Money;
    employerContribution: Money;
    employeeContribution: Money;
  } {
    const bandedEarnings = pensionableSalary.lessThanOrEqual(
      this._lowerLevelForQualifyingEarnings,
    )
      ? zeroGbp
      : Money.min([
          pensionableSalary,
          this._upperLevelForQualifyingEarnings,
        ]).subtract(this._lowerLevelForQualifyingEarnings);

    const employerBandedEarnings = this.getEarningsForPensionCalculation(
      salaryForMaternityPurposes ?? pensionableSalary,
    );
    const employerContribution = employerBandedEarnings
      .amount()
      .mul(employerContributionPercentage)
      .div(100.0);

    return {
      earningsForPensionCalculation:
        this.getEarningsForPensionCalculation(pensionableSalary),
      employerContribution: gbp(employerContribution.round(2, RoundUp)),
      employeeContribution: employeeContributionIsFixedAmount
        ? gbp(employeeContribution)
        : gbp(
            bandedEarnings
              .amount()
              .mul(employeeContribution.div(100.0))
              .round(2, RoundUp),
          ),
    };
  }

  /**
   * @inheritdoc
   */
  protected getEarningsForPensionCalculation(pensionableSalary: Money): Money {
    return pensionableSalary.lessThanOrEqual(
      this._lowerLevelForQualifyingEarnings,
    )
      ? zeroGbp
      : Money.min([
          pensionableSalary,
          this._upperLevelForQualifyingEarnings,
        ]).subtract(this._lowerLevelForQualifyingEarnings);
  }
}
