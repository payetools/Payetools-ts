// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { HmrcTaxYearReferenceDataSet } from "./HmrcTaxYearReferenceDataSet";
import { IHmrcReferenceDataProvider } from "./IHmrcReferenceDataProvider";
import { IHmrcReferenceDataProviderFactory } from "./IHmrcReferenceDataProviderFactory";
import { Logger } from "winston";
import { JsonConvert } from "json2typescript";
import fs from "node:fs/promises";
import { HmrcReferenceDataProvider } from "./HmrcReferenceDataProvider";

/**
 * Factory class that is used to create new HMRC reference data providers that implement
 * IHmrcReferenceDataProvider.
 */
export class HmrcReferenceDataProviderFactory
  implements IHmrcReferenceDataProviderFactory
{
  /**
   * Gets logger for logging.  If not supplied in constructor (or null supplied), no logging is performed.
   */
  protected logger?: Logger;

  private static jsonConvert = new JsonConvert();

  // private static readonly jsonSerializerOptions = {
  //     // See https://github.com/dotnet/runtime/issues/31081 on why we can't just use JsonStringEnumConverter
  //     converters: [
  //         new PayFrequencyJsonConverter(),
  //         new CountriesForTaxPurposesJsonConverter(),
  //         new TaxYearEndingJsonConverter(),
  //         new DateOnlyJsonConverter(),
  //         new NiThresholdTypeJsonConverter(),
  //         new NiCategoryJsonTypeConverter()
  //     ],
  //     propertyNamingPolicy: JsonNamingPolicy.CamelCase
  // };

  /**
   * Initialises a new HmrcReferenceDataProviderFactory.
   * @param logger Implementation of Logger for logging.
   */
  constructor(logger?: Logger) {
    this.logger = logger;
  }

  /**
   * Creates a new HMRC reference data that implements IHmrcReferenceDataProvider using reference
   * data loaded from an array of streams.
   * @param referenceDataFilenames Array of filenames to load HMRC reference data from.
   * @returns An instance of a type that implements IHmrcReferenceDataProvider.
   * @remarks If the method completes successfully, the IHmrcReferenceDataProvider.Health
   * property of the created IHmrcReferenceDataProvider provides human-readable information on
   * the status of each tax year loaded.
   * @throws InvalidReferenceDataException Thrown if it was not possible to load
   * reference data from the supplied set of streams.
   */
  public async createProviderAsync(
    referenceDataFilenames: string[],
  ): Promise<IHmrcReferenceDataProvider> {
    this.logger?.info(
      `Attempting to create implementation of IHmrcReferenceDataProvider with array of Streams; ${referenceDataFilenames.length} streams provided`,
    );

    const dataSets: HmrcTaxYearReferenceDataSet[] = [];

    for (let i = 0; i < referenceDataFilenames.length; i++) {
      const data = await fs.readFile(referenceDataFilenames[i], "utf8");
      const json = JSON.parse(data);

      const entry =
        HmrcReferenceDataProviderFactory.jsonConvert.deserializeObject(
          json,
          HmrcTaxYearReferenceDataSet,
        );

      this.logger?.info(
        `Retrieved reference data for tax year ${entry.applicableTaxYearEnding}, version ${entry.version}`,
      );

      dataSets.push(entry);
    }

    return new HmrcReferenceDataProvider(dataSets);
  }
}
