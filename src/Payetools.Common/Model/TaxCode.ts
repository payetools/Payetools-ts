// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CountriesForTaxPurposes } from "./CountriesForTaxPurposes";
import { TaxYear } from "./TaxYear";
import { TaxTreatment } from "./TaxTreatment";
import { InconsistentDataException } from "../Diagnostics/InconsistentDataException";
import { RoundDown, RoundUp } from "~/CurrencyHelpers";
import Big from "big.js";
import { JsonObject, JsonProperty } from "json2typescript";
import { TaxYearEndingJsonConverter } from "../Serialization/TaxYearEndingJsonConverter";
import { TaxTreatmentJsonConverter } from "../Serialization/TaxTreatmentJsonConverter";
import { CountriesForTaxPurposesJsonConverter } from "../Serialization/CountriesForTaxPurposesJsonConverter";

/**
 * Represents a UK tax code, with the ability to calculate tax-free pay based the code and the relevant tax period.
 */
@JsonObject("TaxCode")
export class TaxCode {
  private static readonly _nonCumulative = "NonCumulative";
  private static readonly _fixedCode = "FixedCode";
  private static readonly _countryPrefix = "CountryPrefix";
  private static readonly _otherPrefix = "OtherPrefix";
  private static readonly _digits = "Digits";
  private static readonly _suffix = "Suffix";

  private static readonly _allCountries: CountriesForTaxPurposes =
    CountriesForTaxPurposes.England |
    CountriesForTaxPurposes.Wales |
    CountriesForTaxPurposes.NorthernIreland |
    CountriesForTaxPurposes.Scotland;

  private static readonly _taxCodeDivisor: Big = Big(500);
  private static readonly _quotientWeeklyTaxFreePay: Big = Big(
    TaxCode._taxCodeDivisor.mul(10).div(52).round(2, RoundUp),
  );
  private static readonly _quotientMonthlyTaxFreePay: Big = Big(
    TaxCode._taxCodeDivisor.mul(10).div(12).round(2, RoundUp),
  );

  /**
   * Gets the tax year that this tax code pertains to.
   */
  @JsonProperty("TaxYear", TaxYear)
  public taxYear: TaxYear = new TaxYear();

  /**
   * Gets a value indicating whether the tax code is cumulative (e.g., 1257L) or non-cumulative (e.g., 1257L W1/M1).
   */
  @JsonProperty("IsNonCumulative", Boolean)
  public isNonCumulative: boolean = false;

  /**
   * Gets the tax treatment specified by this tax code.  For the most part, this is the prefix or suffix for the tax code, omitting the
   * tax regime letter.
   */
  @JsonProperty("TaxTreatment", TaxTreatmentJsonConverter)
  public taxTreatment: TaxTreatment = TaxTreatment.Unspecified;

  /**
   * Gets the country or countries that this tax code applies to, i.e., the tax regime.
   */
  @JsonProperty("ApplicableCountries", CountriesForTaxPurposesJsonConverter)
  public applicableCountries: CountriesForTaxPurposes =
    CountriesForTaxPurposes.None;

  /**
   * Gets the notional annual personal allowance for the tax code.  This may be negative in the event the tax code has a K prefix.
   */
  @JsonProperty("NotionalAllowance", Number)
  public notionalAllowance: number = 0;

  /**
   * Gets the integer portion of the tax code, if applicable, or zero otherwise.
   */
  @JsonProperty("NumericPortionOfCode", Number)
  public numericPortionOfCode: number = 0;

  /**
   * Gets a value indicating whether the tax code is a "fixed code", such as BR, D0, NT, etc., or a variable code, such as 1257L.
   */
  @JsonProperty("IsFixedCode", Boolean)
  public isFixedCode: boolean = false;

  /**
   * Gets the tax regime letter, e.g., S for Scotland, C for Wales.  Returns an empty string if no specific regime is applicable.
   */
  public get taxRegimeLetter(): string {
    return TaxCode.mapCountryToTaxRegime(this.applicableCountries);
  }

  private get baseCode(): string {
    switch (this.taxTreatment) {
      case TaxTreatment._0T:
        return `0T`;
      case TaxTreatment.K:
        return `K${this.numericPortionOfCode}`;
      case TaxTreatment.L:
      case TaxTreatment.M:
      case TaxTreatment.N:
        return `${this.numericPortionOfCode}${this.taxTreatment}`;
      default:
        return `${this.taxTreatment}`;
    }
  }

  private static fromValues(
    taxYear: TaxYear,
    applicableCountries: CountriesForTaxPurposes,
    taxTreatment: TaxTreatment,
    numericPortionOfCode: number,
    isNonCumulative: boolean,
    isFixedCode: boolean = false,
  ): TaxCode {
    const result = new TaxCode();

    result.taxYear = taxYear;
    result.applicableCountries = applicableCountries;
    result.taxTreatment = taxTreatment;
    result.numericPortionOfCode = numericPortionOfCode;
    result.isNonCumulative = isNonCumulative;
    result.isFixedCode = isFixedCode;

    result.notionalAllowance = (() => {
      switch (result.taxTreatment) {
        case TaxTreatment.K:
          return -result.numericPortionOfCode * 10;
        case TaxTreatment.NT:
          return Number.MAX_SAFE_INTEGER;
        default:
          return result.numericPortionOfCode * 10;
      }
    })();

    return result;
  }

  /**
   * Returns the string representation of the tax code including the tax regime letter if applicable, but without
   * any indication of whether the code is cumulative or non-cumulative.
   * @returns String representation of tax code with the tax regime prefix.
   */
  public toString(): string {
    return `${this.taxRegimeLetter}${this.baseCode}`;
  }

  /**
   * Returns the string representation of the tax code optional including the tax regime letter if applicable, and optionally
   * indicating whether the code is cumulative or non-cumulative by means of an "X" suffix.
   * @param includeNonCumulativeFlag True to include the non-cumulative flag; false otherwise.
   * @param includeTaxRegime True to include the tax regime prefix; false otherwise.
   * @returns String representation of tax code with or without tax regime prefix and with or without non-cumulative indicator.
   */
  public toStringWithOptions(
    includeNonCumulativeFlag: boolean,
    includeTaxRegime: boolean,
  ): string {
    if (!includeNonCumulativeFlag && includeTaxRegime) {
      return this.toString();
    } else if (includeNonCumulativeFlag && includeTaxRegime) {
      return this.isNonCumulative ? `${this.toString()} X` : this.toString();
    } else if (!includeNonCumulativeFlag && !includeTaxRegime) {
      return this.baseCode;
    } else {
      return this.isNonCumulative ? `${this.baseCode} X` : this.baseCode;
    }
  }

  /**
   * Attempts to parse the supplied tax code into its component parts, assuming the tax regimes for the current tax year.
   * Non-cumulative codes must be identified by an 'X', 'W1', 'M1' or 'W1/M1' suffix, with or without preceding space.
   * Tax code parsing is case-insensitive.
   * @param taxCode Tax code as a string.
   * @returns Instance of TaxCode if valid; undefined otherwise.
   */
  public static tryParse(taxCode: string): TaxCode | null {
    return TaxCode.tryParseWithTaxYear(
      taxCode,
      TaxYear.fromTaxYearEnding(TaxYear.current),
    );
  }

  /**
   * Attempts to parse the supplied tax code.  Non-cumulative codes must be identified by an 'X', 'W1', 'M1' or 'W1/M1' suffix,
   * with or without preceding space.  Tax code parsing is case-insensitive.
   * @param taxCode Tax code as a string.
   * @param taxYear Tax year for the supplied tax code.
   * @returns Instance of TaxCode if valid; undefined otherwise.
   */
  public static tryParseWithTaxYear(
    taxCode: string,
    taxYear: TaxYear,
  ): TaxCode | null {
    const isNonCumulative = TaxCode.isNonCumulativeCode(taxCode);

    const fixedCodeMatch = TaxCode.getFixedCodeRegex().exec(taxCode);

    let standardCodeMatch: RegExpExecArray | null = null;
    if (fixedCodeMatch == null) {
      standardCodeMatch = TaxCode.getStandardCodeRegex().exec(taxCode);
    }

    let taxCodeResult: TaxCode | null = null;

    let success = false;
    if (fixedCodeMatch != null && standardCodeMatch == null) {
      success = TaxCode.processFixedCodeMatch(
        fixedCodeMatch,
        taxYear,
        isNonCumulative,
        (result) => {
          taxCodeResult = result;
        },
      );
    } else if (fixedCodeMatch == null && standardCodeMatch != null) {
      success =
        standardCodeMatch != null &&
        TaxCode.processStandardCodeMatch(
          standardCodeMatch,
          taxYear,
          isNonCumulative,
          (result) => {
            taxCodeResult = result;
          },
        );
    }

    return success ? taxCodeResult : null;
  }

  /**
   * Calculates the tax free pay for the specified tax period and given tax code.
   * @param taxPeriod Tax period.
   * @param periodCount Number of tax periods in the year (e.g., 12 for monthly pay).
   * @returns Tax-free pay applicable up to and including the end of the specified tax period.  May be negative.
   */
  public getTaxFreePayForPeriod(taxPeriod: number, periodCount: number): Big {
    if (this.numericPortionOfCode === 0) {
      return Big(0);
    }

    let numericPortionOfCode = Big(this.numericPortionOfCode);
    let remainder: Big;
    let quotient: Big;

    if (TaxCode._taxCodeDivisor.lte(numericPortionOfCode)) {
      remainder = numericPortionOfCode.mod(TaxCode._taxCodeDivisor);
      quotient = numericPortionOfCode
        .sub(remainder)
        .div(TaxCode._taxCodeDivisor);

      if (remainder.eq(0)) {
        quotient = quotient.sub(1);
        remainder = Big(500.0);
      }
    } else {
      remainder = numericPortionOfCode;
      quotient = Big(0);
    }

    let taxFreePayForOnePeriod = TaxCode.getQuotientTaxFreePay(periodCount)
      .mul(quotient)
      .add(remainder.mul(10.0).add(9.0).div(periodCount).round(4, RoundDown));

    if (this.taxTreatment === TaxTreatment.K) {
      taxFreePayForOnePeriod = Big(0).sub(taxFreePayForOnePeriod);
    }

    const taxFreePayForPeriod = this.isNonCumulative
      ? taxFreePayForOnePeriod
      : taxFreePayForOnePeriod.mul(taxPeriod);

    return taxFreePayForPeriod;
  }

  private static getQuotientTaxFreePay(periodCount: number): Big {
    switch (periodCount) {
      case 52:
        return TaxCode._quotientWeeklyTaxFreePay;
      case 26:
        return TaxCode._quotientWeeklyTaxFreePay.mul(2);
      case 13:
        return TaxCode._quotientWeeklyTaxFreePay.mul(4);
      case 12:
        return TaxCode._quotientMonthlyTaxFreePay;
      case 1:
        return TaxCode._taxCodeDivisor;
      default:
        throw new Error(`Unsupported value for periodCount: ${periodCount}`);
    }
  }

  private static processFixedCodeMatch(
    match: RegExpExecArray,
    taxYear: TaxYear,
    isNonCumulative: boolean,
    callback: (result: TaxCode) => void,
  ): boolean {
    const fixedCode =
      match.groups == null ? undefined : match.groups[TaxCode._fixedCode];

    if (fixedCode == null) {
      return false;
    }

    const code = fixedCode.toUpperCase();

    let treatment: TaxTreatment;
    switch (code) {
      case "BR":
        treatment = TaxTreatment.BR;
        break;
      case "D0":
        treatment = TaxTreatment.D0;
        break;
      case "D1":
        treatment = TaxTreatment.D1;
        break;
      case "D2":
        treatment = TaxTreatment.D2;
        break;
      case "0T":
        treatment = TaxTreatment._0T;
        break;
      case "NT":
        treatment = TaxTreatment.NT;
        break;
      default:
        treatment = TaxTreatment.Unspecified;
        break;
    }

    if (treatment === TaxTreatment.Unspecified) {
      return false;
    }

    const countries =
      treatment === TaxTreatment.NT
        ? TaxCode._allCountries
        : TaxCode.getApplicableCountries(match, taxYear);
    const allowance =
      treatment === TaxTreatment.NT ? Number.MAX_SAFE_INTEGER : 0;

    const taxCode = TaxCode.fromValues(
      taxYear,
      countries,
      treatment,
      allowance,
      isNonCumulative,
      true,
    );
    callback(taxCode);

    return true;
  }

  private static processStandardCodeMatch(
    match: RegExpExecArray,
    taxYear: TaxYear,
    isNonCumulative: boolean,
    callback: (result: TaxCode) => void,
  ): boolean {
    const otherPrefix =
      match.groups == null ? undefined : match.groups[TaxCode._otherPrefix];
    const digits =
      match.groups == null ? undefined : match.groups[TaxCode._digits];
    const suffix =
      match.groups == null ? undefined : match.groups[TaxCode._suffix];

    if (otherPrefix == null || digits == null || suffix == null) {
      return false;
    }

    const countries = TaxCode.getApplicableCountries(match, taxYear);

    const numericPortionOfCode = parseInt(digits, 10);
    if (Number.isNaN(numericPortionOfCode)) return false;

    let treatment: TaxTreatment;
    switch (TaxCode.toChar(otherPrefix)) {
      case "K":
        treatment = TaxTreatment.K;
        break;
      default:
        switch (TaxCode.toChar(suffix)) {
          case "L":
            treatment = TaxTreatment.L;
            break;
          case "M":
            treatment = TaxTreatment.M;
            break;
          case "N":
            treatment = TaxTreatment.N;
            break;
          default:
            treatment = TaxTreatment.Unspecified;
            break;
        }
        break;
    }

    if (treatment === TaxTreatment.Unspecified) {
      return false;
    }

    const taxCode = TaxCode.fromValues(
      taxYear,
      countries,
      treatment,
      numericPortionOfCode,
      isNonCumulative,
    );
    callback(taxCode);

    return true;
  }

  private static getApplicableCountries(
    match: RegExpExecArray,
    taxYear: TaxYear,
  ): CountriesForTaxPurposes {
    const countryCode =
      match.groups == null ? undefined : match.groups[TaxCode._countryPrefix];

    if (countryCode == null) {
      throw new Error(`${TaxCode._countryPrefix} not found in matched output`);
    }

    let countries: CountriesForTaxPurposes;
    switch (countryCode.toUpperCase()) {
      case "S":
        countries = CountriesForTaxPurposes.Scotland;
        break;
      case "C":
        countries = CountriesForTaxPurposes.Wales;
        break;
      default:
        countries = taxYear.getDefaultCountriesForYear();
        break;
    }

    if (!taxYear.isValidForYear(countries)) {
      throw new InconsistentDataException(
        "Country-specific tax code supplied but country not valid for tax year",
      );
    }

    return countries;
  }

  private static isNonCumulativeCode(taxCode: string): boolean {
    const match = TaxCode.getNonCumulativeRegex().exec(taxCode);

    return (
      match != null &&
      (match.groups == null
        ? undefined
        : match.groups[TaxCode._nonCumulative]) != null
    );
  }

  private static mapCountryToTaxRegime(
    countries: CountriesForTaxPurposes,
  ): string {
    switch (countries) {
      case CountriesForTaxPurposes.Scotland:
        return "S";
      case CountriesForTaxPurposes.Wales:
        return "C";
      default:
        return "";
    }
  }

  private static getNonCumulativeRegex(): RegExp {
    return /^(?:[SC]?(?:BR|NT|K|D[0-2]?)?\d*[TLMN]?\s*(?<NonCumulative>W1M1|W1\/M1|X|W1|M1))$/i;
  }

  private static getFixedCodeRegex(): RegExp {
    return /^(?<CountryPrefix>[SC]?)(?<FixedCode>0T|BR|NT|D0|D1|D2)\s*(?:W1M1|W1\/M1|X|W1|M1)?$/i;
  }

  private static getStandardCodeRegex(): RegExp {
    return /^(?<CountryPrefix>[SC]?)(?<OtherPrefix>[K]?)(?<Digits>\d*)(?<Suffix>[LMN]?)\s*(?:W1M1|W1\/M1|X|W1|M1)?$/i;
  }

  private static toChar(s: string) {
    return s.length == 1 ? s.toUpperCase()[0] : null;
  }
}
