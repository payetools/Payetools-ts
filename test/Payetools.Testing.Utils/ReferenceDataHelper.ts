// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import winston, { Logger, createLogger, transports } from "winston";
import { HmrcReferenceDataProviderFactory } from "~/Payetools.ReferenceData/HmrcReferenceDataProviderFactory";

/**
 * ReferenceDataHelper
 */
export class ReferenceDataHelper {
  private static readonly resourcePaths: string[] = [
    `${__dirname}/../../src/ReferenceData/HmrcReferenceData_2022_2023.json`,
    `${__dirname}/../../src/ReferenceData/HmrcReferenceData_2023_2024.json`,
  ];

  /**
   * GetFactory
   * @returns {HmrcReferenceDataProviderFactory}
   */
  public static getFactory(): HmrcReferenceDataProviderFactory {
    return new HmrcReferenceDataProviderFactory(this.makeLogger());
  }

  /**
   * CreateProviderAsync
   * @template T
   * @returns {Promise<T>}
   */
  public static async createProviderAsync<T>(): Promise<T> {
    //const referenceDataStreams = await Promise.all(this.resourcePaths.map(p => Resource.load(p)));

    const factory = (await this.getFactory().createProviderAsync(
      this.resourcePaths,
    )) as T;
    if (!factory) {
      throw new Error(
        "Unable to cast reference data provider to specified type",
      );
    }

    //referenceDataStreams.forEach(s => s.dispose());

    return factory;
  }

  /**
   * MakeLogger
   * @returns {Logger}
   */
  private static makeLogger(): Logger {
    return createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [new transports.Console()],
    });
  }
}
