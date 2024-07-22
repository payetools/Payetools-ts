// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export interface INiYtdHistoryTestDataEntry {
  definitionVersion: string;
  testIdentifier: string;
  taxYearEnding: TaxYearEnding;
  testReference: string;
  niCategoryPertaining: NiCategory;
  grossNicableEarnings: Money;
  employeeContribution: Money;
  employerContribution: Money;
  totalContribution: Money;
  earningsUpToAndIncludingLEL: Money;
  earningsAboveLELUpToAndIncludingST: Money;
  earningsAboveSTUpToAndIncludingPT: Money;
  earningsAbovePTUpToAndIncludingFUST: Money;
  earningsAboveFUSTUpToAndIncludingUEL: Money;
  earningsAboveUEL: Money;
  earningsAboveSTUpToAndIncludingUEL: Money;
}
