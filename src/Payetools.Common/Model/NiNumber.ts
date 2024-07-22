// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ArgumentException } from "../Diagnostics/ArgumentException";

/**
 * Represents a Uk National Insurance number, also referred to as NI number or NINO.  A NINO is made up of 2 letters, 6 numbers
 * and a final letter which is always A, B, C or D.  (See HMRC's National Insurance Manual, section NIM39110
 * (<see href="https://www.gov.uk/hmrc-internal-manuals/national-insurance-manual/nim39110"/>.)
 */
/** Marked partial as using <em>GeneratedRegexAttribute</em> for .NET 7.0 or above. */
export class NiNumber {
  private static readonly UNKNOWN = "UNKNOWN";

  private static readonly validationRegex = new RegExp(
    "^(?!BG)(?!GB)(?!NK)(?!KN)(?!TN)(?!NT)(?!ZZ)(?:[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z])(?:\\s*\\d\\s*){6}([A-D]|\\s)$",
  );

  private readonly value: string;

  /**
   * Gets a value indicating whether this `NiNumber` instance represents an unknown National
   * Insurance number.
   */
  public get isUnknown(): boolean {
    return this.value === NiNumber.UNKNOWN;
  }

  private static readonly unknown = new NiNumber(true);

  /**
   * Gets the NiNumber to be used when an employee does not know their National Insurance number.
   */
  public static get Unknown(): NiNumber {
    return NiNumber.unknown;
  }

  // public constructor(isUnknown: boolean);
  // public constructor(niNumber: string);
  public constructor(param: boolean | string) {
    if (typeof param === "boolean") {
      if (!param) {
        throw new ArgumentException(
          "This constructor can only be used for unknown NI numbers",
          "isUnknown",
        );
      }
      this.value = NiNumber.UNKNOWN;
    } else {
      const tidiedNiNumber = param.toUpperCase().replaceAll(" ", "");
      if (!NiNumber.isValid(tidiedNiNumber)) {
        throw new ArgumentException(
          "Argument is not a valid National Insurance Number",
          "niNumber",
        );
      }
      this.value = tidiedNiNumber;
    }
  }

  /**
   * Operator for casting implicitly from a `NiNumber` instance to its string representation.
   */
  public static toString(niNumber: NiNumber): string {
    return niNumber.value;
  }

  /**
   * Operator for casting implicitly from a string to an instance of a `NiNumber`.
   */
  public static fromString(niNumber: string): NiNumber {
    return new NiNumber(niNumber);
  }

  /**
   * Verifies whether the supplied string could be a valid NI number.
   */
  public static isValid(value: string): boolean {
    return NiNumber.validationRegex.test(value);
  }

  /**
   * Gets the string representation of this `NiNumber`.
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Gets the string representation of this `NiNumber`.
   * @param asSpacedFormat True if spaced format is to be returned (e.g., "NA 12 34 67 C";
   * false otherwise.
   */
  public toStringWithFormat(asSpacedFormat: boolean): string {
    return asSpacedFormat ? NiNumber.toSpacedFormat(this.value) : this.value;
  }

  private static toSpacedFormat(value: string): string {
    if (value.length === 9) {
      return `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4, 6)} ${value.slice(6, 8)} ${value.slice(-1)}`;
    } else {
      throw new Error("NI numbers must be 9 characters in length");
    }
  }
}
