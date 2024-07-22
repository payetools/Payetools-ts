// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect } from "vitest";
import { HmrcAccountsOfficeReference } from "~/Payetools.Common/Model/HmrcAccountsOfficeReference";

describe("HmrcAccountsOfficeReferenceTests", () => {
  it("TestValidAccountsOfficeReferences", () => {
    let aor = new HmrcAccountsOfficeReference("123PX12345678");
    expect(aor.toString()).toBe("123PX12345678");

    aor = new HmrcAccountsOfficeReference("123PX1234567X");
    expect(aor.toString()).toBe("123PX1234567X");

    aor = new HmrcAccountsOfficeReference("000PY1234567X");
    expect(aor.toString()).toBe("000PY1234567X");
  });

  it("TestInvalidAccountsOfficeReferences", () => {
    expect(() => new HmrcAccountsOfficeReference("")).toThrowError(
      "Argument is not a valid Accounts Office Reference (Parameter 'accountsOfficeReference')",
    );

    expect(() => new HmrcAccountsOfficeReference("123XX12345678")).toThrowError(
      "Argument is not a valid Accounts Office Reference (Parameter 'accountsOfficeReference')",
    );

    expect(() => new HmrcAccountsOfficeReference("12PX123456789")).toThrowError(
      "Argument is not a valid Accounts Office Reference (Parameter 'accountsOfficeReference')",
    );

    expect(() => new HmrcAccountsOfficeReference("123PX1234567")).toThrowError(
      "Argument is not a valid Accounts Office Reference (Parameter 'accountsOfficeReference')",
    );

    expect(() => new HmrcAccountsOfficeReference("123PX1234567Y")).toThrowError(
      "Argument is not a valid Accounts Office Reference (Parameter 'accountsOfficeReference')",
    );

    expect(
      () => new HmrcAccountsOfficeReference("123PX123456789"),
    ).toThrowError(
      "Argument is not a valid Accounts Office Reference (Parameter 'accountsOfficeReference')",
    );
  });

  it("TestImplicitCast", () => {
    const value: string = new HmrcAccountsOfficeReference(
      "123PX12345678",
    ).toString();
    expect(value).toBe("123PX12345678");
  });
});
