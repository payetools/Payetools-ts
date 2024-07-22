// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { IPensionSchemesTestDataEntry } from "./IPensionSchemesTestDataEntry";
import { JsonObject, JsonProperty } from "json2typescript";
import { TaxYearEndingJsonConverter } from "~/Payetools.Common/Serialization/TaxYearEndingJsonConverter";
import { PensionsEarningsBasisJsonConverter } from "~/Payetools.Common/Serialization/PensionsEarningsBasisJsonConverter";
import { PensionTaxTreatmentJsonConverter } from "~/Payetools.Common/Serialization/PensionTaxTreatmentJsonConverter";

@JsonObject("PensionSchemesTestDataEntry")
export class PensionSchemesTestDataEntry
  implements IPensionSchemesTestDataEntry
{
  @JsonProperty("DefinitionVersion", String)
  definitionVersion: string = "";

  @JsonProperty("TestIdentifier", String)
  testIdentifier: string = "";

  @JsonProperty("TaxYearEnding", TaxYearEndingJsonConverter)
  taxYearEnding: TaxYearEnding = TaxYearEnding.Unspecified;

  @JsonProperty("SchemeName", String)
  schemeName: string = "";

  @JsonProperty("EarningsBasis", PensionsEarningsBasisJsonConverter)
  earningsBasis: PensionsEarningsBasis = PensionsEarningsBasis.Unspecified;

  @JsonProperty("TaxTreatment", PensionTaxTreatmentJsonConverter)
  taxTreatment: PensionTaxTreatment = PensionTaxTreatment.Unspecified;
}
