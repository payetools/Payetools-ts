/**
 * Copyright (c) 2023-2024, Payetools Foundation.
 *
 * Payetools Foundation licenses this file to you under the following license(s):
 *
 *   * The MIT License, see https://opensource.org/license/mit/
 */

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { NiThresholdType } from "../Model/NiThresholdType";

const _preApr6_2024NiCategories: Set<NiCategory> = new Set([
  NiCategory.A,
  NiCategory.B,
  NiCategory.C,
  NiCategory.F,
  NiCategory.H,
  NiCategory.I,
  NiCategory.J,
  NiCategory.L,
  NiCategory.M,
  NiCategory.N,
  NiCategory.S,
  NiCategory.V,
  NiCategory.X,
  NiCategory.Z,
]);

const _postApr62024NiCategories: Set<NiCategory> = new Set([
  NiCategory.A,
  NiCategory.B,
  NiCategory.C,
  NiCategory.D,
  NiCategory.E,
  NiCategory.F,
  NiCategory.H,
  NiCategory.I,
  NiCategory.J,
  NiCategory.K,
  NiCategory.L,
  NiCategory.M,
  NiCategory.N,
  NiCategory.S,
  NiCategory.V,
  NiCategory.X,
  NiCategory.Z,
]);

const _preApr62024NiThresholdTypes: Set<NiThresholdType> = new Set([
  NiThresholdType.LEL,
  NiThresholdType.PT,
  NiThresholdType.ST,
  NiThresholdType.FUST,
  NiThresholdType.UST,
  NiThresholdType.AUST,
  NiThresholdType.VUST,
  NiThresholdType.UEL,
  NiThresholdType.DPT,
]);

const _postApr62024NiThresholdTypes: Set<NiThresholdType> = new Set([
  NiThresholdType.LEL,
  NiThresholdType.PT,
  NiThresholdType.ST,
  NiThresholdType.FUST,
  NiThresholdType.IZUST,
  NiThresholdType.UST,
  NiThresholdType.AUST,
  NiThresholdType.VUST,
  NiThresholdType.UEL,
  NiThresholdType.DPT,
]);

/**
 * Gets the set of NI category letters that pertain to a specific tax year.
 * @param {TaxYearEnding} taxYearEnding - Tax year ending value.
 * @returns {Set<NiCategory>} Array of NI categories that pertain to the supplied tax year.
 */
export function getNiCategoriesForTaxYear(
  taxYearEnding: TaxYearEnding,
): Set<NiCategory> {
  return taxYearEnding > TaxYearEnding.Apr5_2024
    ? _postApr62024NiCategories
    : _preApr6_2024NiCategories;
}

/**
 * Gets the set of NI threshold types that pertain to a specific tax year.
 * @param {TaxYearEnding} taxYearEnding - Tax year ending value.
 * @returns {Set<NiThresholdType>} Array of NI threshold types that pertain to the supplied tax year.
 */
export function getNiThresholdTypesForTaxYear(
  taxYearEnding: TaxYearEnding,
): Set<NiThresholdType> {
  return taxYearEnding > TaxYearEnding.Apr5_2024
    ? _postApr62024NiThresholdTypes
    : _preApr62024NiThresholdTypes;
}
