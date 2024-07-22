// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ArgumentException } from "../Diagnostics/ArgumentException";

//import { RegExp } from 'typescript';

/**
 * Represents a UK Postcode.
 */
export class UkPostcode {
  private readonly _value: string;

  /**
   * Operator for casting implicitly from a `UkPostcode` instance to its string equivalent.
   * @param value An instance of `UkPostcode`.
   */
  public static toString(value: UkPostcode): string {
    return value._value;
  }

  /**
   * Operator for casting implicitly from a string to a `UkPostcode`.
   * @param value A valid string representation of a UK postcode.
   */
  public static fromString(value: string): UkPostcode {
    return new UkPostcode(value);
  }

  /**
   * Initialises a new instance of `UkPostcode`.
   * @param value Postcode as string.
   * @param validate Set to false to disable postcode validation. Defaults to true.
   */
  public constructor(value: string, validate: boolean = true) {
    const postcode = value.toUpperCase().trim();

    if (validate && !UkPostcode.isValid(postcode)) {
      throw new ArgumentException(
        `Argument '${value}' is not a valid UK postcode`,
        "value",
      );
    }

    this._value = postcode;
  }

  /**
   * Verifies whether the supplied string could be a valid UK postcode.
   * @param value String value to check.
   * @returns True if the supplied value could be a valid UK postcode; false otherwise.
   * @remarks Although this method confirms whether the string supplied *could* be a valid UK
   * postcode, it does not guarantee that the supplied value is an actual postcode.
   */
  public static isValid(value: string): boolean {
    return this.getValidationRegex().test(value);
  }

  private static getValidationRegex(): RegExp {
    const regex =
      /^(([A-Z]{1,2}\d[A-Z\d]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?\d[A-Z]{2}|BFPO ?\d{1,4}|(KY\d|MSR|VG|AI)[ -]?\d{4}|[A-Z]{2} ?\d{2}|GE ?CX)$/;
    return regex;
  }
}
