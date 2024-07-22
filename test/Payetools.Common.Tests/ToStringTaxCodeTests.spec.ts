// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it } from "vitest";
import { TaxCodeTestHelper } from "./TaxCodeTestHelper";

describe("ToStringTaxCodeTests", () => {
  it("Check1257LCode", () => {
    TaxCodeTestHelper.runToStringTest("1257L", "1257L", false);
    TaxCodeTestHelper.runToStringTest("S1257L", "S1257L", false);
    TaxCodeTestHelper.runToStringTest("C1257L", "C1257L", false);
  });

  it("CheckNonCumulative1257LCode", () => {
    TaxCodeTestHelper.runToStringTest("1257L X", "1257L", true);
    TaxCodeTestHelper.runToStringTest("S1257L X", "S1257L", true);
    TaxCodeTestHelper.runToStringTest("C1257L X", "C1257L", true);
  });

  it("CheckKCode", () => {
    TaxCodeTestHelper.runToStringTest("K1257 X", "K1257", true);
    TaxCodeTestHelper.runToStringTest("SK1257 X", "SK1257", true);
    TaxCodeTestHelper.runToStringTest("CK1257 X", "CK1257", true);
  });

  it("Check1257LFullCode", () => {
    TaxCodeTestHelper.runToFullStringTest("1257L", "1257L", false);
    TaxCodeTestHelper.runToFullStringTest("S1257L", "S1257L", false);
    TaxCodeTestHelper.runToFullStringTest("C1257L", "C1257L", false);
  });

  it("CheckNonCumulative1257LFullCode", () => {
    TaxCodeTestHelper.runToFullStringTest("1257L X", "1257L X", true);
    TaxCodeTestHelper.runToFullStringTest("S1257L X", "S1257L X", true);
    TaxCodeTestHelper.runToFullStringTest("C1257L X", "C1257L X", true);
  });

  it("CheckKFullCode", () => {
    TaxCodeTestHelper.runToFullStringTest("K1257 X", "K1257 X", true);
    TaxCodeTestHelper.runToFullStringTest("SK1257 X", "SK1257 X", true);
    TaxCodeTestHelper.runToFullStringTest("CK1257 X", "CK1257 X", true);
  });
});
