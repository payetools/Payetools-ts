// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { IHmrcIncomeTaxTestDataEntry } from "../IncomeTax/IHmrcIncomeTaxTestDataEntry";

export function getFullTaxCode(
  value: IHmrcIncomeTaxTestDataEntry,
  taxYear: TaxYear,
): TaxCode {
  const nonCumulative = value.w1M1Flag?.toLowerCase() === "wm1" ? " X" : "";
  const input = `${value.taxCode}${nonCumulative}`;

  const out = TaxCode.tryParseWithTaxYear(input, taxYear);
  if (!out) {
    throw new Error(`Unrecognised tax code '${input}'`);
  }

  return out;
}
