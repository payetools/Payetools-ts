// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IHmrcReferenceDataProvider } from "~/Payetools.ReferenceData/IHmrcReferenceDataProvider";
import { ReferenceDataHelper } from "./ReferenceDataHelper";

/**
 * @template T
 * @abstract
 */
export abstract class CalculatorFactoryDataFixture<T extends object> {
  protected factory: Promise<T>;

  public constructor() {
    this.factory = (async () => {
      const provider =
        await ReferenceDataHelper.createProviderAsync<IHmrcReferenceDataProvider>();
      return this.makeFactory(provider);
    })();
  }

  /**
   * @returns {Promise<T>}
   */
  public async getFactory(): Promise<T> {
    if (!this.factory) {
      throw new Error("Factory member uninitialised");
    }
    return await this.factory;
  }

  /**
   * @abstract
   * @param {IHmrcReferenceDataProvider} provider
   * @returns {T}
   */
  protected abstract makeFactory(provider: IHmrcReferenceDataProvider): T;
}
