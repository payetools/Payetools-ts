// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it } from "vitest";
import { TaxTreatment } from "~/Payetools.Common/Model/TaxTreatment";
import { TaxCodeTestHelper } from "./TaxCodeTestHelper";

describe("NonCumulativeTaxCodeTests", () => {
  it("CheckNonCumulativeX", () => {
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BRX", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BR X", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BR  X", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("D0X", TaxTreatment.D0);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("D1 X", TaxTreatment.D1);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("D2  X", TaxTreatment.D2);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("NT X", TaxTreatment.NT);
  });

  it("CheckNonCumulativeW1", () => {
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BRW1", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BR W1", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BR  W1", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("D0W1", TaxTreatment.D0);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("D1 W1", TaxTreatment.D1);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("D2  W1", TaxTreatment.D2);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("NT W1", TaxTreatment.NT);
  });

  it("CheckNonCumulativeM1", () => {
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BRM1", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BR M1", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BR  M1", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("D0M1", TaxTreatment.D0);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("D1 M1", TaxTreatment.D1);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("D2  M1", TaxTreatment.D2);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("NT M1", TaxTreatment.NT);
  });

  it("CheckNonCumulativeM1W1", () => {
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BRW1M1", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BR W1M1", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest(
      "BR  W1M1",
      TaxTreatment.BR,
    );

    TaxCodeTestHelper.runValidNonCumulativeCodeTest("BRW1/M1", TaxTreatment.BR);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest(
      "BR W1/M1",
      TaxTreatment.BR,
    );
    TaxCodeTestHelper.runValidNonCumulativeCodeTest(
      "BR  W1/M1",
      TaxTreatment.BR,
    );
  });

  it("CheckNonCumulative1257LM1W1", () => {
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("1257LX", TaxTreatment.L);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("1257L X", TaxTreatment.L);
    TaxCodeTestHelper.runValidNonCumulativeCodeTest("1257L  X", TaxTreatment.L);

    TaxCodeTestHelper.runValidNonCumulativeCodeTest(
      "1257LW1M1",
      TaxTreatment.L,
    );
    TaxCodeTestHelper.runValidNonCumulativeCodeTest(
      "1257L W1M1",
      TaxTreatment.L,
    );
    TaxCodeTestHelper.runValidNonCumulativeCodeTest(
      "1257L  W1M1",
      TaxTreatment.L,
    );

    TaxCodeTestHelper.runValidNonCumulativeCodeTest(
      "1257MW1/M1",
      TaxTreatment.M,
    );
    TaxCodeTestHelper.runValidNonCumulativeCodeTest(
      "1257N W1/M1",
      TaxTreatment.N,
    );
    TaxCodeTestHelper.runValidNonCumulativeCodeTest(
      "1257L  W1/M1",
      TaxTreatment.L,
    );
  });
});
