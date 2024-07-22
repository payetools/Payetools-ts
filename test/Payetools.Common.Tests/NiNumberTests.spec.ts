// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it } from "vitest";
import { expect } from "chai";
import { ArgumentException } from "~/Payetools.Common/Diagnostics/ArgumentException";
import { NiNumber } from "~/Payetools.Common/Model/NiNumber";

describe("NiNumberTests", () => {
  it("TestValidNiNumbers", () => {
    let niNumber = new NiNumber("AB123456A");
    expect(niNumber.toString()).to.equal("AB123456A");

    niNumber = new NiNumber("HJ 12 34 56 B");
    expect(niNumber.toString()).to.equal("HJ123456B");

    niNumber = new NiNumber("KL 12 34 56 C");
    expect(niNumber.toString()).to.equal("KL123456C");

    niNumber = new NiNumber("  PR12 3456 D  ");
    expect(niNumber.toString()).to.equal("PR123456D");

    niNumber = new NiNumber("ab123456a");
    expect(niNumber.toString()).to.equal("AB123456A");
  });

  it("TestInvalidNiNumbers", () => {
    TestInvalidNiNumber("");

    for (
      let suffix = "E".charCodeAt(0);
      suffix <= "Z".charCodeAt(0);
      suffix++
    ) {
      TestInvalidNiNumber(`AB123456${String.fromCharCode(suffix)}`);
    }

    TestInvalidNiNumber(`AO123456A`);

    TestInvalidNiNumber(`BG123456A`);
    TestInvalidNiNumber(`GB123456A`);
    TestInvalidNiNumber(`KN123456A`);
    TestInvalidNiNumber(`NK123456A`);
    TestInvalidNiNumber(`NT123456A`);
    TestInvalidNiNumber(`TN123456A`);
    TestInvalidNiNumber(`ZZ123456A`);

    const invalidPrefixes = ["D", "F", "I", "Q", "U", "V"];

    for (const prefix of invalidPrefixes) {
      TestInvalidNiNumber(`${prefix}A123456A`);
      TestInvalidNiNumber(`A${prefix}123456A`);
    }
  });

  it("TestImplicitCasts", () => {
    let value: string = new NiNumber("bc654321d").toString();
    expect(value).to.equal("BC654321D");

    let niNumber: NiNumber = new NiNumber("EG 12 45  78 A");
    expect(niNumber.toString()).to.equal("EG124578A");
  });

  it("TestToStringMethods", () => {
    let value = new NiNumber("bc654321d");
    expect(value.toString()).to.equal("BC654321D");
    expect(value.toStringWithFormat(true)).to.equal("BC 65 43 21 D");
  });

  function TestInvalidNiNumber(niNumber: string) {
    expect(() => new NiNumber(niNumber)).to.throw(
      ArgumentException,
      "Argument is not a valid National Insurance Number (Parameter 'niNumber')",
    );
    expect(() => new NiNumber(niNumber.toLowerCase())).to.throw(
      ArgumentException,
      "Argument is not a valid National Insurance Number (Parameter 'niNumber')",
    );
  }
});
