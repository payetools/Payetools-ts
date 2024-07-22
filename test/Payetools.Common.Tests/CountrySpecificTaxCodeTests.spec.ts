// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Test, describe, it } from "vitest";
import { expect } from "chai";
import { CountriesForTaxPurposes } from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { TaxCodeTestHelper } from "./TaxCodeTestHelper";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { TaxTreatment } from "~/Payetools.Common/Model/TaxTreatment";
import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { InconsistentDataException } from "~/Payetools.Common/Diagnostics/InconsistentDataException";

describe("CountrySpecificTaxCodeTests", () => {
  it("CheckD0CountrySpecificCodes", () => {
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "D0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
      TaxTreatment.D0,
      CountriesForTaxPurposes.England | CountriesForTaxPurposes.NorthernIreland,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "SD0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
      TaxTreatment.D0,
      CountriesForTaxPurposes.Scotland,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "CD0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
      TaxTreatment.D0,
      CountriesForTaxPurposes.Wales,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "D0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2022),
      TaxTreatment.D0,
      CountriesForTaxPurposes.England | CountriesForTaxPurposes.NorthernIreland,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "SD0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2022),
      TaxTreatment.D0,
      CountriesForTaxPurposes.Scotland,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "CD0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2022),
      TaxTreatment.D0,
      CountriesForTaxPurposes.Wales,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "D0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2021),
      TaxTreatment.D0,
      CountriesForTaxPurposes.England | CountriesForTaxPurposes.NorthernIreland,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "SD0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2022),
      TaxTreatment.D0,
      CountriesForTaxPurposes.Scotland,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "CD0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2021),
      TaxTreatment.D0,
      CountriesForTaxPurposes.Wales,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "D0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2020),
      TaxTreatment.D0,
      CountriesForTaxPurposes.England | CountriesForTaxPurposes.NorthernIreland,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "SD0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2020),
      TaxTreatment.D0,
      CountriesForTaxPurposes.Scotland,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "CD0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2020),
      TaxTreatment.D0,
      CountriesForTaxPurposes.Wales,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "D0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2019),
      TaxTreatment.D0,
      CountriesForTaxPurposes.England |
        CountriesForTaxPurposes.NorthernIreland |
        CountriesForTaxPurposes.Wales,
    );
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "SD0",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2019),
      TaxTreatment.D0,
      CountriesForTaxPurposes.Scotland,
    );
  });

  it("CheckNTCountrySpecificCodes", () => {
    TaxCodeTestHelper.runFixedCodeCountrySpecificTest(
      "NT",
      TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2023),
      TaxTreatment.NT,
      CountriesForTaxPurposes.England |
        CountriesForTaxPurposes.NorthernIreland |
        CountriesForTaxPurposes.Wales |
        CountriesForTaxPurposes.Scotland,
    );
  });

  it("CheckInvalidCountryForYear", () => {
    const action = () =>
      TaxCode.tryParseWithTaxYear(
        "C1257L",
        TaxYear.fromTaxYearEnding(TaxYearEnding.Apr5_2019),
      );

    expect(action).to.throw(
      InconsistentDataException,
      "Country-specific tax code supplied but country not valid for tax year",
    );
  });
});
