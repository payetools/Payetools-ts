// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { JsonObject, JsonProperty } from "json2typescript";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";

/**
 * Represents the reference data needed to perform Employment Allowance calculations.
 */
@JsonObject("EmploymentAllowanceInfo")
export class EmploymentAllowanceInfo {
  /**
   * Gets the value of the annual Employment Allowance.
   */
  @JsonProperty("annualAllowance", MoneyJsonConverter)
  public annualAllowance: Money;

  /**
   * Gets the threshold up to which employers are eligible for Employment Allowance.
   */
  @JsonProperty("employersAllowanceThreshold", MoneyJsonConverter)
  public employersAllowanceThreshold: Money;

  constructor(annualAllowance: Money, employersAllowanceThreshold: Money) {
    this.annualAllowance = annualAllowance;
    this.employersAllowanceThreshold = employersAllowanceThreshold;
  }
}
