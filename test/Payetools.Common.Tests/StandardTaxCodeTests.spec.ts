// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect } from "vitest";
import { CountriesForTaxPurposes } from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { TaxTreatment } from "~/Payetools.Common/Model/TaxTreatment";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { TaxCodeTestHelper } from "./TaxCodeTestHelper";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";

describe("StandardTaxCodeTests", () => {
  it("Check1257LCode", () => {
    TaxCodeTestHelper.runStandardCodeTest(
      "1257L",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
      TaxTreatment.L,
      12570,
      CountriesForTaxPurposes.England | CountriesForTaxPurposes.NorthernIreland,
    );
    TaxCodeTestHelper.runStandardCodeTest(
      "S1257L",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
      TaxTreatment.L,
      12570,
      CountriesForTaxPurposes.Scotland,
    );
    TaxCodeTestHelper.runStandardCodeTest(
      "C1257L",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
      TaxTreatment.L,
      12570,
      CountriesForTaxPurposes.Wales,
    );
  });

  it("CheckKCodes", () => {
    TaxCodeTestHelper.runStandardCodeTest(
      "K1052",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
      TaxTreatment.K,
      -10520,
      CountriesForTaxPurposes.England | CountriesForTaxPurposes.NorthernIreland,
    );
    TaxCodeTestHelper.runStandardCodeTest(
      "SK1234",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
      TaxTreatment.K,
      -12340,
      CountriesForTaxPurposes.Scotland,
    );
    TaxCodeTestHelper.runStandardCodeTest(
      "CK2345",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
      TaxTreatment.K,
      -23450,
      CountriesForTaxPurposes.Wales,
    );
  });

  it("CheckInvalidCode", () => {
    const taxCode = TaxCode.tryParseWithTaxYear(
      "AB123C",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
    );

    expect(taxCode).toBeNull();
  });
});
