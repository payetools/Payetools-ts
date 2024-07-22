// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonObject, JsonProperty } from "json2typescript";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";
import { IStudentLoanRateSet } from "~/Payetools.StudentLoans/ReferenceData/IStudentLoanRateSet";

/**
 * Represents the set of deduction rates to be applied for student and post-graduate loans.
 */
@JsonObject("StudentLoanRatesSet")
export class StudentLoanRatesSet implements IStudentLoanRateSet {
  /**
   * Gets the deduction rate for Plan 1, 2 and 4 student loan deductions.
   */
  @JsonProperty("student", BigJsonConverter)
  student: Big;

  /**
   * Gets the deduction rate for post-graduate student loan deductions.
   */
  @JsonProperty("postGrad", BigJsonConverter)
  postGrad: Big;

  constructor(student: Big, postGrad: Big) {
    this.student = student;
    this.postGrad = postGrad;
  }
}
