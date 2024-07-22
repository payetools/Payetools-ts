// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it } from "vitest";
import { expect } from "chai";
import { UkPostcode } from "~/Payetools.Common/Model/UkPostcode";
import { ArgumentException } from "~/Payetools.Common/Diagnostics/ArgumentException";

namespace Payetools.Common.Tests {
  describe("UkPostcodeTests", () => {
    it("TestValidPostcodes", () => {
      const validPostcodes: string[] = [
        "W1J 7NT",
        "DE128HJ",
        "SW1A 1AA",
        "JE23XP",
        "IM9 4EB",
        "GY79YH",
      ];

      validPostcodes.forEach((validPostcode) => {
        const act = () => new UkPostcode(validPostcode);
        expect(act).to.not.throw();
      });
    });

    it("TestInvalidPostcodes", () => {
      const invalidPostcodes: string[] = [
        "W1J-7NT",
        "DE9998HJ",
        "SW1A11",
        "JE23XP123V",
        "IEB",
        "GYXXYH",
      ];

      invalidPostcodes.forEach((invalidPostcode) => {
        const act = () => new UkPostcode(invalidPostcode);
        expect(act).to.throw(
          ArgumentException,
          `Argument '${invalidPostcode}' is not a valid UK postcode (Parameter 'value')`,
        );
      });
    });
  });
}
