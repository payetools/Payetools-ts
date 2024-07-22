// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect } from "vitest";
import { HmrcPayeReference } from "~/Payetools.Common/Model/HmrcPayeReference";

describe("HmrcPayeReferenceTests", () => {
  it("TestValidPayeReferences", () => {
    let result = HmrcPayeReference.tryParse("123/ABC");
    expect(result?.toString()).toBe("123/ABC");
    expect(result?.hmrcOfficeNumber).toBe(123);
    expect(result?.employerPayeReference).toBe("ABC");

    result = HmrcPayeReference.tryParse(" 456 / ABC12345");
    expect(result?.toString()).toBe("456/ABC12345");
    expect(result?.hmrcOfficeNumber).toBe(456);
    expect(result?.employerPayeReference).toBe("ABC12345");
  });

  it("TestInvalidAccountsOfficeReferences", () => {
    let result = HmrcPayeReference.tryParse("1/ABC");
    expect(result).toBeNull();

    result = HmrcPayeReference.tryParse("123/ABC1212121212121");
    expect(result).toBeNull();

    result = HmrcPayeReference.tryParse("123/?$%");
    expect(result).toBeNull();

    result = HmrcPayeReference.tryParse(null);
    expect(result).toBeNull();

    result = HmrcPayeReference.tryParse("");
    expect(result).toBeNull();
  });

  it("TestImplicitCast", () => {
    let result = HmrcPayeReference.tryParse("123 / ABC");
    let stringResult = result?.toString() ?? "";
    expect(stringResult).toBe("123/ABC");
  });
});
