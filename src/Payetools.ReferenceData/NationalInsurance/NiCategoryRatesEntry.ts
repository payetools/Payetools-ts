// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonObject, JsonProperty } from "json2typescript";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { INiCategoryRatesEntry } from "~/Payetools.NationalInsurance/ReferenceData/INiCategoryRatesEntry";
import { NiCategoryJsonConverter } from "../Serialization/NiCategoryJsonTypeConverter";
import Big from "big.js";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";

/**
 * Represents a set of National Insurance rates applicable to a specific NI category.
 */
@JsonObject("NiCategoryRatesEntry")
export class NiCategoryRatesEntry implements INiCategoryRatesEntry {
  /**
   * Gets the applicable National Insurance Category.
   */
  @JsonProperty("category", NiCategoryJsonConverter)
  public category: NiCategory;

  /**
   * Gets or sets the employee rate for earnings at or above lower earnings limit up to and including primary threshold.
   */
  @JsonProperty("employeeRateToPT", BigJsonConverter)
  public employeeRateToPT: Big = Big(0);

  /**
   * Gets or sets the employee rate for earnings above the primary threshold up to and including upper earnings limit.
   */
  @JsonProperty("employeeRatePTToUEL", BigJsonConverter)
  public employeeRatePTToUEL: Big = Big(0);

  /**
   * Gets or sets the employee rate for balance of earnings above upper earnings limit.
   */
  @JsonProperty("employeeRateAboveUEL", BigJsonConverter)
  public employeeRateAboveUEL: Big = Big(0);

  /**
   * Gets or sets the employer rate for earnings at or above lower earnings limit up to and including secondary threshold.
   */
  @JsonProperty("employerRateLELToST", BigJsonConverter)
  public employerRateLELToST: Big = Big(0);

  /**
   * Gets or sets the employer rate for earnings above secondary threshold up to and including Freeport upper secondary threshold.
   */
  @JsonProperty("employerRateSTToFUST", BigJsonConverter)
  public employerRateSTToFUST: Big = Big(0);

  /**
   * Gets or sets the employer rate for earnings above Freeport upper secondary threshold up to and including upper earnings limit, upper
   * secondary thresholds for under 21s, apprentices and veterans.
   */
  @JsonProperty("employerRateFUSTToUEL", BigJsonConverter)
  public employerRateFUSTToUEL: Big = Big(0);

  /**
   * Gets or sets the employer rate for balance of earnings above upper earnings limit, upper secondary thresholds for under 21s, apprentices
   * and veterans.
   */
  @JsonProperty("employerRateAboveUEL", BigJsonConverter)
  public employerRateAboveUEL: Big = Big(0);

  /**
   * Initialises a new instance of `NiCategoryRatesEntry` for the specified NI category.
   * @param category NI category for this NiCategoryRatesEntry.
   */
  constructor(category: NiCategory) {
    this.category = category;
  }

  /**
   * Gets a string representation of this `NiCategoryRatesEntry`.
   * @returns String representation of this instance.
   */
  public toString(): string {
    return `(EmployeeRateToPT:${this.employeeRateToPT}, EmployeeRatePTToUEL:${this.employeeRatePTToUEL}, EmployeeRateAboveUEL:${this.employeeRateAboveUEL}, EmployerRateLELtoST:${this.employerRateLELToST}, EmployerRateSTtoFUST:${this.employerRateSTToFUST}, EmployerRateFUSTtoUEL:${this.employerRateFUSTToUEL}, EmployerRateAboveUEL:${this.employerRateAboveUEL})`;
  }
}
