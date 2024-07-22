// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { describe, it, expect } from "vitest";
import { Title } from "~/Payetools.Common/Model/Title";

describe("TitleTests", () => {
  it("TestStandardisedTitles", () => {
    expect(Title.parse("mr")!.toString()).toBe("Mr");
    expect(Title.parse("MR")!.toString()).toBe("Mr");
    expect(Title.parse("Mr.")!.toString()).toBe("Mr");

    expect(Title.parse("mrs")!.toString()).toBe("Mrs");
    expect(Title.parse("mrs.")!.toString()).toBe("Mrs");
    expect(Title.parse("MRS")!.toString()).toBe("Mrs");

    expect(Title.parse("ms")!.toString()).toBe("Ms");
    expect(Title.parse("MS")!.toString()).toBe("Ms");

    expect(Title.parse("Miss")!.toString()).toBe("Miss");
    expect(Title.parse("MISS")!.toString()).toBe("Miss");

    expect(Title.parse("prof")!.toString()).toBe("Prof.");
    expect(Title.parse("PROF.")!.toString()).toBe("Prof.");
    expect(Title.parse("Professor")!.toString()).toBe("Prof.");

    expect(Title.parse("dr")!.toString()).toBe("Dr.");
    expect(Title.parse("DR.")!.toString()).toBe("Dr.");
    expect(Title.parse("DOCTOR")!.toString()).toBe("Dr.");

    expect(Title.parse("rev")!.toString()).toBe("Rev.");
    expect(Title.parse("rev.")!.toString()).toBe("Rev.");
    expect(Title.parse("REVEREND")!.toString()).toBe("Rev.");
    expect(Title.parse("REVD")!.toString()).toBe("Rev.");
    expect(Title.parse("Revd.")!.toString()).toBe("Rev.");
  });

  it("TestEmptyTitles", () => {
    expect(Title.parse("")).toBeNull();
    expect(Title.parse("   ")).toBeNull();
  });

  it("TestNonStandardisedTitle", () => {
    expect(Title.parse("The Right Honourable")!.toString()).toBe(
      "The Right Honourable",
    );
  });

  it("TestOverlengthTitle", () => {
    const action = () =>
      Title.parse(
        "The Right Honourable Mighty One and Only Most Majestic And Humble",
      );
    expect(action).toThrowError(
      new Error(
        "Titles may not exceed 35 characters in length (Parameter 'title')",
      ),
    );
  });

  it("TestImplicitCasts", () => {
    expect(Title.parse("mr")?.toString()).toBe("Mr");

    expect(Title.parse("")).toBeNull();
  });
});
