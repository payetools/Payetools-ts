// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect } from "vitest";
import {
  CountriesForTaxPurposes,
  CountriesForTaxPurposesConverter,
} from "~/Payetools.Common/Model/CountriesForTaxPurposes";

describe("CountriesForTaxPurposesConverterTests", () => {
  it("TestConvertToEnum", () => {
    let input = "GB-ENG";
    expect(CountriesForTaxPurposesConverter.toEnum(input)).toBe(
      CountriesForTaxPurposes.England,
    );

    input += " GB-NIR";
    expect(CountriesForTaxPurposesConverter.toEnum(input)).toBe(
      CountriesForTaxPurposes.England | CountriesForTaxPurposes.NorthernIreland,
    );

    input += " GB-WLS";
    expect(CountriesForTaxPurposesConverter.toEnum(input)).toBe(
      CountriesForTaxPurposes.England |
        CountriesForTaxPurposes.NorthernIreland |
        CountriesForTaxPurposes.Wales,
    );

    input = "GB-WLS GB-NIR GB-ENG";
    expect(CountriesForTaxPurposesConverter.toEnum(input)).toBe(
      CountriesForTaxPurposes.England |
        CountriesForTaxPurposes.NorthernIreland |
        CountriesForTaxPurposes.Wales,
    );

    input = "GB-SCT";
    expect(CountriesForTaxPurposesConverter.toEnum(input)).toBe(
      CountriesForTaxPurposes.Scotland,
    );

    input = "GB-WLS";
    expect(CountriesForTaxPurposesConverter.toEnum(input)).toBe(
      CountriesForTaxPurposes.Wales,
    );

    input = "GB-XYZ";
    expect(() => CountriesForTaxPurposesConverter.toEnum(input)).toThrowError(
      new Error("Unrecognised country 'GB-XYZ' (Parameter 'iso3166Countries')"),
    );
  });

  it("TestConvertToISO3166String", () => {
    let countries = CountriesForTaxPurposes.England;
    expect(CountriesForTaxPurposesConverter.toString(countries)).toBe("GB-ENG");

    countries |= CountriesForTaxPurposes.NorthernIreland;
    expect(CountriesForTaxPurposesConverter.toString(countries)).toBe(
      "GB-ENG GB-NIR",
    );

    countries |= CountriesForTaxPurposes.Wales;
    expect(CountriesForTaxPurposesConverter.toString(countries)).toBe(
      "GB-ENG GB-NIR GB-WLS",
    );

    countries = CountriesForTaxPurposes.Scotland;
    expect(CountriesForTaxPurposesConverter.toString(countries)).toBe("GB-SCT");

    countries = CountriesForTaxPurposes.Wales;
    expect(CountriesForTaxPurposesConverter.toString(countries)).toBe("GB-WLS");
  });
});
