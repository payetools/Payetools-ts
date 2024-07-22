// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { PensionContributionsCalculatorFactoryDataFixture } from "./PensionContributionsCalculatorFactoryDataFixture";
import { beforeAll, describe, expect, it } from "vitest";
import { IPensionContributionCalculator } from "~/Payetools.Pensions/IPensionContributionCalculator";
import { Money } from "@dintero/money";
import Big from "big.js";
import { gbp, zeroGbp } from "~/CurrencyHelpers";

describe("SalaryExchangePensionablePaySetTests", () => {
  const _payDate = new PayDate(2022, 4, 6, PayFrequency.Monthly);
  const _factoryProviderFixture =
    new PensionContributionsCalculatorFactoryDataFixture();

  /**
   * @vitest.suite
   */
  it("TestPensionablePayAsync", async () => {
    const calculator = await getCalculator(
      PensionsEarningsBasis.PensionablePaySet1,
      PensionTaxTreatment.NetPayArrangement,
    );

    const pensionableSalary = gbp(5366.59);
    const employerContributionPct = Big(3.0);
    const employeeContributionPct = Big(4.0);
    const avc = zeroGbp;
    const employeeContributionIsAmount = false;

    // const employersNiSaving = gbp(Big(0.138).mul(employeeContributionIsAmount ?
    //   undefined :
    //   (employeeContributionPct.div(100.0)).mul(pensionableSalary.amount())) ?? Big(0.0));
    const employersNiSaving = gbp(29.6235768);

    testCalculation(
      calculator,
      pensionableSalary,
      employerContributionPct,
      employeeContributionPct,
      null,
      avc,
      employeeContributionIsAmount,
      employersNiSaving,
      gbp(405.28),
      gbp(161.0),
      gbp(29.62),
    );
  });

  function testCalculation(
    calculator: IPensionContributionCalculator,
    pensionableSalary: Money,
    employerContributionPct: Big,
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
      undefined,
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
    expect(result.bandedEarnings).toBeUndefined();
    expect([
      PensionsEarningsBasis.PensionablePaySet1,
      PensionsEarningsBasis.PensionablePaySet2,
      PensionsEarningsBasis.PensionablePaySet3,
    ]).toContain(result.earningsBasis);
    expect(result.employeeAvcAmount).toBe(avc);
    expect(
      result.employerContributionAmountBeforeSalaryExchange?.toNumber(),
    ).toBe(expectedEmployerContributionBeforeSE.toNumber());
    expect(result.employerNiSavingsToReinvest?.toNumber()).toBe(
      expectedEmployerNiSaving.toNumber(),
    );
  }

  async function getCalculator(
    earningsBasis: PensionsEarningsBasis,
    taxTreatment: PensionTaxTreatment,
  ): Promise<IPensionContributionCalculator> {
    const provider = await _factoryProviderFixture.getFactory();

    return provider.getCalculator(earningsBasis, taxTreatment, _payDate);
  }
});
