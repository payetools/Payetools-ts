// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ArgumentException } from "../Diagnostics/ArgumentException";

/**
 * Represents an HMRC Accounts Office Reference, as defined at
 * https://design.tax.service.gov.uk/hmrc-design-patterns/accounts-office-reference/,
 * which is formatted as follows:
 * - 3 numbers
 * - The letter 'P'
 * - 8 numbers, or 7 numbers and the letter ‘X’
 */
export class HmrcAccountsOfficeReference {
  private static readonly validationRegex: RegExp =
    /^[0-9]{3}P[A-Z]\d{7}[0-9X]$/;
  private readonly accountsOfficeReference: string;

  /**
   * Operator for casting implicitly from a HmrcAccountsOfficeReference instance to its string equivalent.
   * @param value An instance of HmrcAccountsOfficeReference.
   */
  public static implicitToString(value: HmrcAccountsOfficeReference): string {
    return value.toString();
  }

  /**
   * Operator for casting implicitly from a string to a HmrcAccountsOfficeReference.
   * @param value A string that can be converted to a HmrcAccountsOfficeReference.
   * @throws Error if the supplied string is not a valid HMRC accounts office reference.
   */
  public static implicitFromString(value: string): HmrcAccountsOfficeReference {
    return new HmrcAccountsOfficeReference(value);
  }

  /**
   * Initialises a new instance of HmrcAccountsOfficeReference.
   * @param accountsOfficeReference String value containing the HMRC Accounts Office Reference.
   * @throws ArgumentException if the supplied string value does not match the required pattern for valid HMRC Accounts Office Reference values.
   */
  constructor(accountsOfficeReference: string) {
    const aor = accountsOfficeReference.toUpperCase();

    if (!HmrcAccountsOfficeReference.isValid(aor)) {
      throw new ArgumentException(
        "Argument is not a valid Accounts Office Reference",
        "accountsOfficeReference",
      );
    }

    this.accountsOfficeReference = aor;
  }

  /**
   * Verifies whether the supplied string could be a valid HRMC Accounts Office Reference.
   * @param value String value to check.
   * @returns True if the supplied value could be a valid HMRC Accounts Office Reference; false otherwise.
   * @remarks Although this method confirms whether the string supplied could be a valid HRMC Accounts Office
   * Reference, it does not guarantee that the supplied value is registered with HMRC against a given company.
   */
  public static isValid(value: string): boolean {
    return HmrcAccountsOfficeReference.validationRegex.test(value);
  }

  /**
   * Gets the string representation of this HmrcAccountsOfficeReference.
   * @returns The value of this HmrcAccountsOfficeReference as a string.
   */
  public toString(): string {
    return this.accountsOfficeReference;
  }
}
