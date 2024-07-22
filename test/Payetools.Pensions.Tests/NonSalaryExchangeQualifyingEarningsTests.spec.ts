// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, beforeEach, it, expect } from "vitest";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { IPensionContributionCalculator } from "~/Payetools.Pensions/IPensionContributionCalculator";
import { PensionContributionsCalculatorFactoryDataFixture } from "./PensionContributionsCalculatorFactoryDataFixture";
import { Money } from "@dintero/money";
import Big from "big.js";
import { gbp, zeroGbp } from "~/CurrencyHelpers";

describe("NonSalaryExchangeQualifyingEarningsTests", () => {
  let payDate: PayDate;
  let factoryProviderFixture: PensionContributionsCalculatorFactoryDataFixture;

  beforeEach(() => {
    payDate = new PayDate(2022, 4, 6, PayFrequency.Monthly);
    factoryProviderFixture =
      new PensionContributionsCalculatorFactoryDataFixture();
  });

  it("should test earnings below lower limit for QE NPA", async () => {
    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.NetPayArrangement,
    );

    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const pensionableSalary = gbp(519.0);
    const expectedBandedEarnings = pensionableSalary.greaterThan(lowerLimit)
      ? Money.min([pensionableSalary, upperLimit]).subtract(lowerLimit)
      : zeroGbp;
    const employerContributionPct = Big(3.0);
    const employeeContributionPct = Big(5.0);
    const avc = gbp(0.0);
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
    );
  });

  it("should test earnings at lower limit for QE NPA", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.NetPayArrangement,
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
    );
  });

  it("should test earnings just below upper limit for QE NPA", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.NetPayArrangement,
    );

    const pensionableSalary = gbp(4188.0);
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
      gbp(110.04),
      gbp(183.4),
    );
  });

  it("should test earnings at upper limit for QE NPA", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.NetPayArrangement,
    );

    const pensionableSalary = gbp(4189.0);
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
      gbp(110.07),
      gbp(183.45),
    );
  });

  it("should test earnings above upper limit for QE NPA", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.NetPayArrangement,
    );

    const pensionableSalary = gbp(5000.0);
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
      gbp(110.07),
      gbp(183.45),
    );
  });

  it("should test earnings below lower limit for QE RAS", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.ReliefAtSource,
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
    );
  });

  it("should test earnings at lower limit for QE RAS", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.ReliefAtSource,
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
    );
  });

  it("should test earnings just below upper limit for QE RAS", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.ReliefAtSource,
    );

    const pensionableSalary = gbp(4188.0);
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
      gbp(110.04),
      gbp(146.72),
    );
  });

  it("should test earnings at upper limit for QE RAS", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.ReliefAtSource,
    );

    const pensionableSalary = gbp(4189.0);
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
      gbp(110.07),
      gbp(146.76),
    );
  });

  it("should test earnings above upper limit for QE RAS", async () => {
    const lowerLimit = gbp(520.0);
    const upperLimit = gbp(4189.0);

    const calculator = await getCalculator(
      PensionsEarningsBasis.QualifyingEarnings,
      PensionTaxTreatment.ReliefAtSource,
    );

    const pensionableSalary = gbp(5000.0);
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
      gbp(110.07),
      gbp(146.76),
    );
  });

  const testCalculation = (
    calculator: IPensionContributionCalculator,
    pensionableSalary: Money,
    expectedBandedEarnings: Money,
    employerContributionPct: Big,
    employerContributionAmount: Money | null,
    employeeContributionPct: Big | null,
    employeeContributionAmount: Money | null,
    avc: Money,
    employeeContributionIsAmount: boolean,
    expectedEmployerContribution: Money,
    expectedEmployeeContribution: Money,
  ) => {
    const result = calculator.calculate(
      pensionableSalary,
      employerContributionPct,
      false,
      (employeeContributionIsAmount
        ? employeeContributionAmount?.amount()
        : employeeContributionPct) ?? Big(0.0),
      employeeContributionIsAmount,
      avc,
      null,
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
    expect(result.employerContributionPercentage.toNumber()).toBe(
      employerContributionPct.toNumber(),
    );
    expect(result.calculatedEmployeeContributionAmount.toNumber()).toBe(
      expectedEmployeeContribution.toNumber(),
    );
    expect(result.calculatedEmployerContributionAmount.toNumber()).toBe(
      expectedEmployerContribution.toNumber(),
    );
    expect(result.salaryExchangeApplied).toBe(false);
    expect(result.bandedEarnings?.toNumber()).toBe(
      expectedBandedEarnings.toNumber(),
    );
    expect(result.earningsBasis).toBe(PensionsEarningsBasis.QualifyingEarnings);
    expect(result.employeeAvcAmount?.toNumber()).toBe(avc.toNumber());
    expect(
      result.employerContributionAmountBeforeSalaryExchange,
    ).toBeUndefined();
    expect(result.employerNiSavingsToReinvest).toBeUndefined();
  };

  async function getCalculator(
    earningsBasis: PensionsEarningsBasis,
    taxTreatment: PensionTaxTreatment,
  ): Promise<IPensionContributionCalculator> {
    const provider = await factoryProviderFixture.getFactory();

    return provider.getCalculator(earningsBasis, taxTreatment, payDate);
  }
});
