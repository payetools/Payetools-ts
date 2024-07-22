// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ArgumentException } from "../Diagnostics/ArgumentException";

/**
 * Represents one or more countries within the United Kingdom for tax purposes.  For example,
 * Scotland has had its own thresholds and rates of income tax since 2016.  Note that this enum is marked with
 * the [Flags] attribute as it is possible to combine countries for situations where the same set of tax
 * parameters applies to more than one country, e.g. England and Northern Ireland.
 */
export enum CountriesForTaxPurposes {
  /** None */
  None = 0,

  /** England */
  England = 1,

  /** Northern Ireland */
  NorthernIreland = 2,

  /** Scotland */
  Scotland = 4,

  /** Wales */
  Wales = 8,
}

/**
 * Converter that translates between the string format of countries based on ISO-3166 and CountriesForTaxPurposes enum values.
 */
export class CountriesForTaxPurposesConverter {
  private static readonly Iso3166_England = "GB-ENG";
  private static readonly Iso3166_NorthernIreland = "GB-NIR";
  private static readonly Iso3166_Scotland = "GB-SCT";
  private static readonly Iso3166_Wales = "GB-WLS";

  /**
   * Gets the ISO-3166 sub-entity for the supplied country or countries enum value.
   * @param countries Instance of CountriesForTaxPurposes specifying one or more countries with the UK.
   * @returns Space separated ISO-3166 countries list, e.g., "GB-ENG GB-NIR".
   */
  public static toString(countries: CountriesForTaxPurposes): string {
    let result: string[] = [];

    if (countries & CountriesForTaxPurposes.England)
      result.push(this.Iso3166_England);

    if (countries & CountriesForTaxPurposes.NorthernIreland)
      result.push(this.Iso3166_NorthernIreland);

    if (countries & CountriesForTaxPurposes.Scotland)
      result.push(this.Iso3166_Scotland);

    if (countries & CountriesForTaxPurposes.Wales)
      result.push(this.Iso3166_Wales);

    return result.join(" ");
  }

  /**
   * Gets the CountriesForTaxPurposes enum value for the supplied country or space separated list of
   * ISO-3166 countries, e.g., "GB-ENG GB-NIR".
   * @param iso3166Countries Space separated list of ISO-3166 countries.
   * @returns Equivalent CountriesForTaxPurposes enum value.
   * @throws Error if an invalid country value is supplied.
   */
  public static toEnum(
    iso3166Countries: string | null,
  ): CountriesForTaxPurposes {
    let countries: CountriesForTaxPurposes = 0;

    if (iso3166Countries) {
      const applicableCountries = iso3166Countries.split(" ").filter(Boolean);

      for (const ac of applicableCountries) {
        switch (ac) {
          case this.Iso3166_England:
            countries |= CountriesForTaxPurposes.England;
            break;
          case this.Iso3166_NorthernIreland:
            countries |= CountriesForTaxPurposes.NorthernIreland;
            break;
          case this.Iso3166_Scotland:
            countries |= CountriesForTaxPurposes.Scotland;
            break;
          case this.Iso3166_Wales:
            countries |= CountriesForTaxPurposes.Wales;
            break;
          default:
            throw new ArgumentException(
              `Unrecognised country '${ac}'`,
              "iso3166Countries",
            );
        }
      }
    }

    return countries;
  }
}
