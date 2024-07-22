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

describe("NonSalaryExchangePensionablePaySetTests", () => {
  const _payDate = new PayDate(2022, 4, 6, PayFrequency.Monthly);
  let _factoryProviderFixture: PensionContributionsCalculatorFactoryDataFixture;

  beforeEach(() => {
    _factoryProviderFixture =
      new PensionContributionsCalculatorFactoryDataFixture();
  });

  it("TestPensionablePay_NPA", async () => {
    const calculator = await getCalculator(
      PensionsEarningsBasis.PensionablePaySet1,
      PensionTaxTreatment.NetPayArrangement,
    );

    const pensionableSalary = gbp(4129.52);
    const employerContributionPct = Big(3.0);
    const employeeContributionPct = Big(5.0);
    const avc = zeroGbp;
    const employeeContributionIsAmount = false;

    testCalculation(
      calculator,
      pensionableSalary,
      employerContributionPct,
      null,
      employeeContributionPct,
      null,
      avc,
      employeeContributionIsAmount,
      gbp(123.89),
      gbp(206.48),
    );
  });

  it("TestPensionablePay_RAS", async () => {
    const calculator = await getCalculator(
      PensionsEarningsBasis.PensionablePaySet2,
      PensionTaxTreatment.ReliefAtSource,
    );

    const pensionableSalary = gbp(3769.42);
    const employerContributionPct = Big(3.0);
    const employeeContributionPct = Big(5.0);
    const avc = zeroGbp;
    const employeeContributionIsAmount = false;

    testCalculation(
      calculator,
      pensionableSalary,
      employerContributionPct,
      null,
      employeeContributionPct,
      null,
      avc,
      employeeContributionIsAmount,
      gbp(113.08),
      gbp(150.78),
    );
  });

  const testCalculation = (
    calculator: IPensionContributionCalculator,
    pensionableSalary: Money,
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
    expect(result.bandedEarnings).toBeUndefined();
    expect([
      PensionsEarningsBasis.PensionablePaySet1,
      PensionsEarningsBasis.PensionablePaySet2,
      PensionsEarningsBasis.PensionablePaySet3,
    ]).toContain(result.earningsBasis);
    expect(result.employeeAvcAmount?.toNumber()).toBe(avc.toNumber());
    expect(
      result.employerContributionAmountBeforeSalaryExchange,
    ).toBeUndefined();
    expect(result.employerNiSavingsToReinvest).toBeUndefined();
  };

  const getCalculator = async (
    earningsBasis: PensionsEarningsBasis,
    taxTreatment: PensionTaxTreatment,
  ) => {
    const provider = await _factoryProviderFixture.getFactory();
    return provider.getCalculator(earningsBasis, taxTreatment, _payDate);
  };
});
