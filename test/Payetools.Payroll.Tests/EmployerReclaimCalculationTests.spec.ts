// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import Big from "big.js";
import { expect, test } from "vitest";
import { gbp, zeroGbp } from "~/CurrencyHelpers";
import { StatutoryPaymentReclaimCalculator } from "~/Payetools.Payroll/Hmrc/StatutoryPaymentReclaimCalculator";
import { Employer } from "~/Payetools.Payroll/Model/Employer";
import { EmployerHistoryEntry } from "~/Payetools.Payroll/Model/EmployerHistoryEntry";
import { IEmployer } from "~/Payetools.Payroll/Model/IEmployer";
import { IEmployerHistoryEntry } from "~/Payetools.Payroll/Model/IEmployerHistoryEntry";
import { StatutoryPaymentReclaimInfo } from "~/Payetools.ReferenceData/Employer/StatutoryPaymentReclaimInfo";

test("TestEmployerEligibleForSER", () => {
  const input = makeHistoryEntry();
  const employer = makeEmployer(true);

  const calculator = new StatutoryPaymentReclaimCalculator(makeReclaimInfo());

  const reclaim = calculator.calculate(employer, input);

  expect(reclaim).not.toBeNull();
  expect(reclaim.reclaimableStatutoryMaternityPay.toNumber()).toBe(
    input.totalStatutoryMaternityPay.toNumber(),
  );
  expect(reclaim.reclaimableStatutoryAdoptionPay.toNumber()).toBe(
    input.totalStatutoryAdoptionPay.toNumber(),
  );
  expect(reclaim.reclaimableStatutoryPaternityPay.toNumber()).toBe(
    input.totalStatutoryPaternityPay.toNumber(),
  );
  expect(reclaim.reclaimableStatutorySharedParentalPay.toNumber()).toBe(
    input.totalStatutorySharedParentalPay.toNumber(),
  );
  expect(reclaim.reclaimableStatutoryParentalBereavementPay.toNumber()).toBe(
    input.totalStatutoryParentalBereavementPay.toNumber(),
  );
  expect(reclaim.additionalNiCompensationOnSMP.toNumber()).toBe(27.83);
  expect(reclaim.additionalNiCompensationOnSAP.toNumber()).toBe(18.39);
  expect(reclaim.additionalNiCompensationOnSPP.toNumber()).toBe(3.63);
  expect(reclaim.additionalNiCompensationOnSShPP.toNumber()).toBe(2.02);
  expect(reclaim.additionalNiCompensationOnSPBP.toNumber()).toBe(6.04);
});

test("TestEmployerIneligibleForSER", () => {
  const input = makeHistoryEntry();
  const employer = makeEmployer(false);

  const calculator = new StatutoryPaymentReclaimCalculator(makeReclaimInfo());

  const reclaim = calculator.calculate(employer, input);

  expect(reclaim).not.toBeNull();
  expect(reclaim.reclaimableStatutoryMaternityPay.toNumber()).toBe(853.36);
  expect(reclaim.reclaimableStatutoryAdoptionPay.toNumber()).toBe(563.74);
  expect(reclaim.reclaimableStatutoryPaternityPay.toNumber()).toBe(111.1);
  expect(reclaim.reclaimableStatutorySharedParentalPay.toNumber()).toBe(61.84);
  expect(reclaim.reclaimableStatutoryParentalBereavementPay.toNumber()).toBe(
    185.23,
  );
  expect(reclaim.additionalNiCompensationOnSMP.toNumber()).toBe(0.0);
  expect(reclaim.additionalNiCompensationOnSAP.toNumber()).toBe(0.0);
  expect(reclaim.additionalNiCompensationOnSPP.toNumber()).toBe(0.0);
  expect(reclaim.additionalNiCompensationOnSShPP.toNumber()).toBe(0.0);
  expect(reclaim.additionalNiCompensationOnSPBP.toNumber()).toBe(0.0);
});

function makeHistoryEntry(): IEmployerHistoryEntry {
  const result = new EmployerHistoryEntry(
    0,
    zeroGbp,
    zeroGbp,
    zeroGbp,
    zeroGbp,
    zeroGbp,
    gbp(927.56),
    gbp(120.76),
    gbp(612.76),
    gbp(67.21),
    gbp(201.33),
  );

  return result;
}

function makeReclaimInfo(): StatutoryPaymentReclaimInfo {
  return new StatutoryPaymentReclaimInfo(zeroGbp, Big(0.92), Big(1.03));
}

function makeEmployer(isEligibleForEmploymentAllowance: boolean): IEmployer {
  return new Employer(
    null,
    "",
    null,
    null,
    null,
    false,
    null,
    isEligibleForEmploymentAllowance,
  );
}
