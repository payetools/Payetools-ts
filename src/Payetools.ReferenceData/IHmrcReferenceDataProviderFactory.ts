// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Stream } from "stream";
import { IHmrcReferenceDataProvider } from "./IHmrcReferenceDataProvider";

/**
 * Interface for factory classes that are used to create new HMRC reference data providers that implement
 * {@link IHmrcReferenceDataProvider}.
 *
 * @remarks If the createProviderAsync method completes successfully, the {@link IHmrcReferenceDataProvider.health}
 * property of the created {@link IHmrcReferenceDataProvider} provides human-readable information on
 * the status of each tax year loaded.
 */
export interface IHmrcReferenceDataProviderFactory {
  /**
   * Creates a new HMRC reference data that implements {@link IHmrcReferenceDataProvider} using reference
   * data loaded from an array of streams.
   *
   * @param referenceDataFilenames - Array of filenames to load HMRC reference data from.
   * @returns An instance of a type that implements {@link IHmrcReferenceDataProvider}.
   */
  createProviderAsync(
    referenceDataFilenames: string[],
  ): Promise<IHmrcReferenceDataProvider>;
}
