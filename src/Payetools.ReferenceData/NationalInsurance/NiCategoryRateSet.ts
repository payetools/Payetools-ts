// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { NiCategoryRatesEntry } from "./NiCategoryRatesEntry";
import { INiCategoryRatesEntry } from "~/Payetools.NationalInsurance/ReferenceData/INiCategoryRatesEntry";

/**
 * Represents a set of National Insurance rates across all NI categories. Each NI
 * category specifies its own set rate of rates across the various NI thresholds.
 */
export class NiCategoryRateSet {
  private categories: Map<NiCategory, INiCategoryRatesEntry>;

  /**
   * Initialises a new instance of `NiCategoryRateSet`.
   */
  constructor() {
    this.categories = new Map<NiCategory, INiCategoryRatesEntry>();
  }

  /**
   * Gets the set of NI rates applicable to the specified `NiCategory`.
   * @param category - NI category to retrieve the applicable rates for.
   * @returns Set of rates applicable to the specified NI category.
   */
  getRatesForCategory(category: NiCategory): INiCategoryRatesEntry {
    return this.categories.get(category) as INiCategoryRatesEntry;
  }

  internalAdd(category: NiCategory, rates: NiCategoryRatesEntry): void {
    this.categories.set(category, rates);
  }
}
