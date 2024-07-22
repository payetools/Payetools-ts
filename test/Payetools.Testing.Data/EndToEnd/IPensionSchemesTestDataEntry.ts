// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export interface IPensionSchemesTestDataEntry {
  definitionVersion: string;
  testIdentifier: string;
  taxYearEnding: TaxYearEnding;
  schemeName: string;
  earningsBasis: PensionsEarningsBasis;
  taxTreatment: PensionTaxTreatment;
}
