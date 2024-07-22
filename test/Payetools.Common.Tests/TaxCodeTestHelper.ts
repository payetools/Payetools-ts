// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { expect } from "vitest";
import { CountriesForTaxPurposes } from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { TaxTreatment } from "~/Payetools.Common/Model/TaxTreatment";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export class TaxCodeTestHelper {
  private static readonly _testTaxYear = TaxYear.fromTaxYearEnding(
    TaxYearEnding.Apr5_2022,
  );

  public static runFixedCodeTest(
    input: string,
    expectedTreatment: TaxTreatment,
  ) {
    let result = TaxCode.tryParseWithTaxYear(
      input.toLowerCase(),
      this._testTaxYear,
    );
    expect(result!.taxTreatment).toBe(expectedTreatment);

    result = TaxCode.tryParse(input.toUpperCase());
    expect(result!.taxTreatment).toBe(expectedTreatment);
  }

  public static runInvalidCodeTest(input: string) {
    let result = TaxCode.tryParseWithTaxYear(
      input.toLowerCase(),
      this._testTaxYear,
    );
    expect(result).toBeNull();

    result = TaxCode.tryParse(input.toUpperCase());
    expect(result).toBeNull();
  }

  public static runValidNonCumulativeCodeTest(
    input: string,
    expectedTreatment: TaxTreatment,
  ) {
    let result = TaxCode.tryParseWithTaxYear(
      input.toLowerCase(),
      this._testTaxYear,
    );
    expect(result!.isNonCumulative).toBe(true);

    result = TaxCode.tryParse(input.toUpperCase());
    expect(result!.isNonCumulative).toBe(true);
    expect(result!.taxTreatment).toBe(expectedTreatment);
  }

  public static runFixedCodeCountrySpecificTest(
    input: string,
    taxYear: TaxYear,
    expectedTreatment: TaxTreatment,
    expectedCountries: CountriesForTaxPurposes,
  ) {
    let result = TaxCode.tryParseWithTaxYear(input.toLowerCase(), taxYear);
    expect(result!.taxTreatment).toBe(expectedTreatment);
    expect(result!.applicableCountries).toBe(expectedCountries);

    result = TaxCode.tryParseWithTaxYear(input.toUpperCase(), taxYear);
    expect(result!.taxTreatment).toBe(expectedTreatment);
    expect(result!.applicableCountries).toBe(expectedCountries);
  }

  public static runStandardCodeTest(
    input: string,
    taxYear: TaxYear,
    expectedTreatment: TaxTreatment,
    expectedAllowance: number,
    expectedCountries: CountriesForTaxPurposes,
  ) {
    let result = TaxCode.tryParseWithTaxYear(input.toLowerCase(), taxYear);
    expect(result!.taxTreatment).toBe(expectedTreatment);
    expect(result!.applicableCountries).toBe(expectedCountries);
    expect(result!.notionalAllowance).toBe(expectedAllowance);

    result = TaxCode.tryParseWithTaxYear(input.toUpperCase(), taxYear);
    expect(result!.taxTreatment).toBe(expectedTreatment);
    expect(result!.applicableCountries).toBe(expectedCountries);
    expect(result!.notionalAllowance).toBe(expectedAllowance);
  }

  public static runToStringTest(
    input: string,
    expectedOutput: string,
    expectedIsNonCumulative: boolean,
  ) {
    let result = TaxCode.tryParseWithTaxYear(
      input.toLowerCase(),
      this._testTaxYear,
    );
    expect(result!.toString()).toBe(expectedOutput);
    expect(result!.isNonCumulative).toBe(expectedIsNonCumulative);

    result = TaxCode.tryParse(input.toUpperCase());
    expect(result!.toString()).toBe(expectedOutput);
    expect(result!.isNonCumulative).toBe(expectedIsNonCumulative);
  }

  public static runToFullStringTest(
    input: string,
    expectedOutput: string,
    expectedIsNonCumulative: boolean,
  ) {
    let result = TaxCode.tryParseWithTaxYear(
      input.toLowerCase(),
      this._testTaxYear,
    );
    expect(result!.toStringWithOptions(true, true)).toBe(expectedOutput);
    expect(result!.isNonCumulative).toBe(expectedIsNonCumulative);

    result = TaxCode.tryParse(input.toUpperCase());
    expect(result!.toStringWithOptions(true, true)).toBe(expectedOutput);
    expect(result!.isNonCumulative).toBe(expectedIsNonCumulative);
  }
}
