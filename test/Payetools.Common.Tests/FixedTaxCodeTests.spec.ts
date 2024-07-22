// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it } from "vitest";
import { TaxCodeTestHelper } from "./TaxCodeTestHelper";
import { TaxTreatment } from "~/Payetools.Common/Model/TaxTreatment";

describe("FixedTaxCodeTests", () => {
  it("CheckNTCode", () => {
    TaxCodeTestHelper.runFixedCodeTest("NT", TaxTreatment.NT);
  });

  it("CheckDXCodes", () => {
    TaxCodeTestHelper.runFixedCodeTest("D0", TaxTreatment.D0);
    TaxCodeTestHelper.runFixedCodeTest("D1", TaxTreatment.D1);
    TaxCodeTestHelper.runFixedCodeTest("D2", TaxTreatment.D2);
    TaxCodeTestHelper.runFixedCodeTest("SD0", TaxTreatment.D0);
    TaxCodeTestHelper.runFixedCodeTest("SD1", TaxTreatment.D1);
    TaxCodeTestHelper.runFixedCodeTest("SD2", TaxTreatment.D2);
    TaxCodeTestHelper.runFixedCodeTest("CD0", TaxTreatment.D0);
    TaxCodeTestHelper.runFixedCodeTest("CD1", TaxTreatment.D1);
    TaxCodeTestHelper.runFixedCodeTest("CD2", TaxTreatment.D2);
  });

  it("CheckBRCodes", () => {
    TaxCodeTestHelper.runFixedCodeTest("BR", TaxTreatment.BR);
    TaxCodeTestHelper.runFixedCodeTest("SBR", TaxTreatment.BR);
    TaxCodeTestHelper.runFixedCodeTest("CBR", TaxTreatment.BR);
  });

  it("Check0TCodes", () => {
    TaxCodeTestHelper.runFixedCodeTest("0T", TaxTreatment._0T);
    TaxCodeTestHelper.runFixedCodeTest("S0T", TaxTreatment._0T);
    TaxCodeTestHelper.runFixedCodeTest("C0T", TaxTreatment._0T);
  });

  it("CheckInvalidCodes", () => {
    TaxCodeTestHelper.runInvalidCodeTest("NX");
    TaxCodeTestHelper.runInvalidCodeTest("BY");
    TaxCodeTestHelper.runInvalidCodeTest("AR");
    TaxCodeTestHelper.runInvalidCodeTest("D3");
    TaxCodeTestHelper.runInvalidCodeTest("XBR");
    TaxCodeTestHelper.runInvalidCodeTest("CJR");
    TaxCodeTestHelper.runInvalidCodeTest("SD5");
  });
});
