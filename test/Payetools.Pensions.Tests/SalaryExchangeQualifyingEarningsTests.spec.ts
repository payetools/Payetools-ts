// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect, beforeEach } from "vitest";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { IPensionContributionCalculator } from "~/Payetools.Pensions/IPensionContributionCalculator";
import { PensionContributionsCalculatorFactoryDataFixture } from "./PensionContributionsCalculatorFactoryDataFixture";
import { Money } from "@dintero/money";
import { gbp, zeroGbp } from "~/CurrencyHelpers";
import Big from "big.js";

describe("SalaryExchangeQualifyingEarningsTests", () => {
  const _payDate = new PayDate(2022, 4, 6, PayFrequency.Monthly);
  let _factoryProviderFixture: PensionContributionsCalculatorFactoryDataFixture;

  beforeEach(() => {
    _factoryProviderFixture =
      new PensionContributionsCalculatorFactoryDataFixture();
  });

  /**
   * @test
   */
  it("TestEarningsBelowLowerLimitForQEAsync", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.Unspecified,
    );

    const pensionableSalary = gbp(519.0);
    const expectedBandedEarnings = pensionableSalary.greaterThan(lowerLimit)
      ? Money.min([pensionableSalary, upperLimit]).subtract(lowerLimit)
      : zeroGbp;
    const employerContributionPct = Big(3.0);
    const employeeContributionPct = Big(5.0);
    const avc = zeroGbp;
    const employeeContributionIsAmount = false;

    testCalculation(
      calculator,
      pensionableSalary,
      expectedBandedEarnings,
      employerContributionPct,
      null,
      employeeContributionPct,
      null,
      avc,
      employeeContributionIsAmount,
      zeroGbp,
      zeroGbp,
      zeroGbp,
      zeroGbp,
    );
  });

  /**
   * @test
   */
  it("TestEarningsAtLowerLimitForQEAsync", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.Unspecified,
    );

    const pensionableSalary = gbp(520.0);
    const expectedBandedEarnings = pensionableSalary.greaterThan(lowerLimit)
      ? Money.min([pensionableSalary, upperLimit]).subtract(lowerLimit)
      : zeroGbp;
    const employerContributionPct = Big(3.0);
    const employeeContributionPct = Big(5.0);
    const avc = zeroGbp;
    const employeeContributionIsAmount = false;

    testCalculation(
      calculator,
      pensionableSalary,
      expectedBandedEarnings,
      employerContributionPct,
      null,
      employeeContributionPct,
      null,
      avc,
      employeeContributionIsAmount,
      zeroGbp,
      zeroGbp,
      zeroGbp,
      zeroGbp,
    );
  });

  /**
   * @test
   */
  it("TestEarningsJustBelowUpperLimitForQEAsync", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.Unspecified,
    );

    const pensionableSalary = gbp(4188.0);
    const expectedBandedEarnings = pensionableSalary.greaterThan(lowerLimit)
      ? Money.min([pensionableSalary, upperLimit]).subtract(lowerLimit)
      : zeroGbp;
    const employerContributionPct = Big(3.0);
    const employeeContributionPct = Big(5.0);
    const avc = zeroGbp;
    const employeeContributionIsAmount = false;
    const employersNiSaving = gbp(25.3092);

    testCalculation(
      calculator,
      pensionableSalary,
      expectedBandedEarnings,
      employerContributionPct,
      null,
      employeeContributionPct,
      null,
      avc,
      employeeContributionIsAmount,
      employersNiSaving,
      gbp(318.75),
      gbp(110.04),
      gbp(25.31),
    );
  });

  /**
   * @test
   */
  it("TestEarningsAtUpperLimitForQEAsync", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.Unspecified,
    );

    const pensionableSalary = gbp(4189.0);
    const expectedBandedEarnings = pensionableSalary.greaterThan(lowerLimit)
      ? Money.min([pensionableSalary, upperLimit]).subtract(lowerLimit)
      : zeroGbp;
    const employerContributionPct = Big(3.0);
    const employeeContributionPct = Big(5.0);
    const avc = zeroGbp;
    const employeeContributionIsAmount = false;
    const employersNiSaving = gbp(25.3161);

    testCalculation(
      calculator,
      pensionableSalary,
      expectedBandedEarnings,
      employerContributionPct,
      null,
      employeeContributionPct,
      null,
      avc,
      employeeContributionIsAmount,
      employersNiSaving,
      gbp(318.84),
      gbp(110.07),
      gbp(25.32),
    );
  });

  /**
   * @test
   */
  it("TestEarningsAboveUpperLimitForQEAsync", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.Unspecified,
    );

    const pensionableSalary = gbp(5000.0);
    const expectedBandedEarnings = pensionableSalary.greaterThan(lowerLimit)
      ? Money.min([pensionableSalary, upperLimit]).subtract(lowerLimit)
      : zeroGbp;
    const employerContributionPct = Big(3.0);
    const employeeContributionPct = Big(5.0);
    const avc = zeroGbp;
    const employeeContributionIsAmount = false;
    const employersNiSaving = gbp(25.3161);

    testCalculation(
      calculator,
      pensionableSalary,
      expectedBandedEarnings,
      employerContributionPct,
      null,
      employeeContributionPct,
      null,
      avc,
      employeeContributionIsAmount,
      employersNiSaving,
      gbp(318.84),
      gbp(110.07),
      gbp(25.32),
    );
  });

  function testCalculation(
    calculator: IPensionContributionCalculator,
    pensionableSalary: Money,
    expectedBandedEarnings: Money,
    employerContributionPct: Big,
    employerContributionAmount: Money | null,
    employeeContributionPct: Big | null,
    employeeContributionAmount: Money | null,
    avc: Money,
    employeeContributionIsAmount: boolean,
    employersNiSaving: Money,
    expectedEmployerContribution: Money,
    expectedEmployerContributionBeforeSE: Money,
    expectedEmployerNiSaving: Money,
  ) {
    const result = calculator.calculateUnderSalaryExchange(
      pensionableSalary,
      employerContributionPct,
      false,
      employersNiSaving,
      Big(100.0),
      (employeeContributionIsAmount
        ? employeeContributionAmount!.amount()
        : employeeContributionPct) ?? zeroGbp.amount(),
      employeeContributionIsAmount,
      avc,
    );

    expect(result.pensionableSalaryInPeriod.toNumber()).toBe(
      pensionableSalary.toNumber(),
    );
    expect(result.employeeContributionPercentage?.toNumber()).toBe(
      employeeContributionPct?.toNumber(),
    );
    expect(result.employeeContributionFixedAmount?.toNumber()).toBe(
      employeeContributionAmount?.toNumber(),
    );
    expect(result.employerContributionPercentage?.toNumber()).toBe(
      employerContributionPct?.toNumber(),
    );
    expect(result.calculatedEmployeeContributionAmount.toNumber()).toBe(
      avc.toNumber(),
    );
    expect(result.calculatedEmployerContributionAmount.toNumber()).toBe(
      expectedEmployerContribution.toNumber(),
    );
    expect(result.salaryExchangeApplied).toBe(true);
    expect(result.bandedEarnings?.toNumber()).toBe(
      expectedBandedEarnings.toNumber(),
    );
    expect(result.earningsBasis).toBe(PensionsEarningsBasis.QualifyingEarnings);
    expect(result.employeeAvcAmount).toBe(avc);
    expect(
      result.employerContributionAmountBeforeSalaryExchange?.toNumber(),
    ).toBe(expectedEmployerContributionBeforeSE.toNumber());
    expect(result.employerNiSavingsToReinvest?.toNumber()).toBe(
      expectedEmployerNiSaving.toNumber(),
    );
  }

  const getCalculator = async (
    earningsBasis: PensionsEarningsBasis,
    taxTreatment: PensionTaxTreatment,
  ) => {
    const provider = await _factoryProviderFixture.getFactory();

    return provider.getCalculator(earningsBasis, taxTreatment, _payDate);
  };
});
