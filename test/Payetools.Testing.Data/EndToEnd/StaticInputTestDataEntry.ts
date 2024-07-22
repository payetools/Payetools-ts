// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { StudentLoanType } from "~/Payetools.Common/Model/StudentLoanType";
import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IStaticInputTestDataEntry } from "./IStaticInputTestDataEntry";
import { Money } from "@dintero/money";
import { JsonObject, JsonProperty } from "json2typescript";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";
import { NiCategoryJsonConverter } from "~/Payetools.ReferenceData/Serialization/NiCategoryJsonTypeConverter";
import { BigJsonConverter } from "~/Payetools.Common/Serialization/BigJsonConverter";
import { MoneyJsonConverter } from "~/Payetools.Common/Serialization/MoneyJsonConverter";
import { TaxCodeJsonConverter } from "~/Payetools.Common/Serialization/TaxCodeJsonConverter";
import { StudentLoanTypeJsonConverter } from "~/Payetools.Common/Serialization/StudentLoanTypeJsonConverter";

@JsonObject("StaticInputTestDataEntry")
export class StaticInputTestDataEntry implements IStaticInputTestDataEntry {
  @JsonProperty("DefinitionVersion", String)
  definitionVersion: string = "";

  @JsonProperty("TestIdentifier", String)
  testIdentifier: string = "";

  @JsonProperty("TaxYearEnding", TaxYearEndingJsonConverter)
  taxYearEnding: TaxYearEnding = TaxYearEnding.Unspecified;

  @JsonProperty("TestReference", String)
  testReference: string = "";

  @JsonProperty("EmployeeFirstName", String)
  employeeFirstName: string = "";

  @JsonProperty("EmployeeLastName", String)
  employeeLastName: string = "";

  @JsonProperty("TaxCode", TaxCodeJsonConverter)
  taxCode: TaxCode = undefined!;

  @JsonProperty("NiCategory", NiCategoryJsonConverter)
  niCategory: NiCategory = NiCategory.Unspecified;

  @JsonProperty("StudentLoanPlan", StudentLoanTypeJsonConverter, true)
  studentLoanPlan?: StudentLoanType;

  @JsonProperty("GraduateLoan", Boolean)
  graduateLoan: boolean = false;

  @JsonProperty("PensionScheme", String, true)
  pensionScheme?: string;

  @JsonProperty("UsesSalaryExchange", Boolean)
  usesSalaryExchange: boolean = false;

  @JsonProperty("EmployeePercentage", BigJsonConverter, true)
  employeePercentage?: Big;

  @JsonProperty("EmployeeFixedAmount", MoneyJsonConverter, true)
  employeeFixedAmount?: Money;

  @JsonProperty("EmployerPercentage", BigJsonConverter, true)
  employerPercentage?: Big;
}
