// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionContributionCalculator } from "./PensionContributionCalculator";
import { Money } from "@dintero/money";
import { RoundHalfUp, RoundUp, gbp } from "~/CurrencyHelpers";

/**
 * Represents a pension contribution calculator for Pensionable Pay Set 1, 2 and 3.
 */
export class PensionablePaySetCalculator extends PensionContributionCalculator {
  /**
   * @inheritdoc
   */
  public override earningsBasis: PensionsEarningsBasis;

  /**
   * Initializes a new instance of `PensionablePaySetCalculator` for the specified earnings basic and tax treatment.
   * @param earningsBasis Specifies the earnings basis for this calculator. Must be one of Pensionable Pay Set 1,
   * Pensionable Pay Set 2 or Pensionable Pay Set 3.
   * @param taxTreatment Tax treatment for the target pension, i.e., net pay arrangement vs relief at source.
   * @param basicRateOfTax Basic rate of tax to use for relief at source pensions.
   * @throws {Error} Thrown if an invalid earnings basis is supplied.
   */
  constructor(
    earningsBasis: PensionsEarningsBasis,
    taxTreatment: PensionTaxTreatment,
    basicRateOfTax?: Big,
  ) {
    super(taxTreatment, basicRateOfTax);

    if (
      earningsBasis !== PensionsEarningsBasis.PensionablePaySet1 &&
      earningsBasis !== PensionsEarningsBasis.PensionablePaySet2 &&
      earningsBasis !== PensionsEarningsBasis.PensionablePaySet3
    ) {
      throw new Error(
        "Earnings basis must be one of PensionablePaySet1, PensionablePaySet2 or PensionablePaySet3",
      );
    }

    this.earningsBasis = earningsBasis;
  }

  /**
   * @inheritdoc
   */
  protected override calculateContributions(
    pensionableSalary: Money,
    employerContributionPercentage: Big,
    employeeContribution: Big,
    employeeContributionIsFixedAmount: boolean = false,
    salaryForMaternityPurposes: Money | null,
  ): {
    earningsForPensionCalculation: Money;
    employerContribution: Money;
    employeeContribution: Money;
  } {
    return {
      earningsForPensionCalculation: pensionableSalary,
      employerContribution: gbp(
        pensionableSalary
          .amount()
          .mul(employerContributionPercentage.div(100.0).round(2, RoundHalfUp)),
      ),
      employeeContribution: employeeContributionIsFixedAmount
        ? gbp(employeeContribution)
        : gbp(
            pensionableSalary
              .amount()
              .mul(employeeContribution.div(100.0))
              .round(2, RoundHalfUp),
          ),
    };
  }

  /**
   * @inheritdoc
   */
  protected override getEarningsForPensionCalculation(
    pensionableSalary: Money,
  ): Money {
    return pensionableSalary;
  }
}
