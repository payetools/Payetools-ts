// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IncomeTaxReferenceDataEntry } from "./IncomeTax/IncomeTaxReferenceDataEntry";
import { NmwReferenceDataEntry } from "./NationalMinimumWage/NmwReferenceDataEntry";
import { PensionsReferenceDataSet } from "./Pensions/PensionsReferenceDataSet";
import { StudentLoanReferenceDataEntry } from "./StudentLoans/StudentLoanReferenceDataEntry";
import { JsonObject, JsonProperty } from "json2typescript";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";
import { NiReferenceDataEntry } from "./NationalInsurance/NiReferenceDataEntry";

/**
 * Data structure used to represent HMRC reference data for a given tax year.
 */
@JsonObject("HmrcTaxYearReferenceDataSet")
export class HmrcTaxYearReferenceDataSet {
  /**
   * Gets the version of this data set.  Every time the data set is updated centrally, the version number is incremented.
   */
  @JsonProperty("version", String)
  version: string = "Not specified";

  /**
   * Gets the latest update timestamp for this data set.
   */
  @JsonProperty("latestUpdateTimestamp")
  latestUpdateTimestamp?: Date;

  /**
   * Gets the tax year to which this data set applies.
   */
  @JsonProperty("applicableTaxYearEnding", TaxYearEndingJsonConverter)
  applicableTaxYearEnding: TaxYearEnding = TaxYearEnding.Unspecified;

  /**
   * Gets a set of IncomeTaxReferenceDataEntry, each entry applicable to a portion of the tax year. Where
   * the same regime applies across the entire tax year, this set contains only one entry.
   */
  @JsonProperty("incomeTax", [IncomeTaxReferenceDataEntry])
  incomeTax: IncomeTaxReferenceDataEntry[] = [];

  /**
   * Gets a set of NiReferenceDataEntry, each entry applicable to a portion of the tax year. Where
   * the same regime applies across the entire tax year, this set contains only one entry.
   */
  @JsonProperty("nationalInsurance", [NiReferenceDataEntry])
  nationalInsurance: NiReferenceDataEntry[] = [];

  /**
   * Gets a set of PensionsReferenceDataSet, each entry applicable to a portion of the tax year. Where
   * the same regime applies across the entire tax year, this set contains only one entry.
   */
  @JsonProperty("pensions", [PensionsReferenceDataSet])
  pensions: PensionsReferenceDataSet[] = [];

  /**
   * Gets a set of NmwReferenceDataEntry, each entry applicable to a portion of the tax year. Where
   * the same regime applies across the entire tax year, this set contains only one entry.
   */
  @JsonProperty("nationalMinimumWage", [NmwReferenceDataEntry])
  nationalMinimumWage: NmwReferenceDataEntry[] = [];

  /**
   * Gets a set of StudentLoanReferenceDataEntry, each entry applicable to a portion of the tax year. Where
   * the same regime applies across the entire tax year, this set contains only one entry.
   */
  @JsonProperty("studentLoans", [StudentLoanReferenceDataEntry])
  studentLoans: StudentLoanReferenceDataEntry[] = [];

  /**
   * Gets a set of EmployerReferenceDataEntry, each entry applicable to a portion of the tax year. Where
   * the same regime applies across the entire tax year, this set contains only one entry.
   */
  @JsonProperty("employer", [NmwReferenceDataEntry], true)
  employer?: NmwReferenceDataEntry[];
}
