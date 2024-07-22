// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Represents an HMRC PAYE Reference, as defined at
 * {@link https://design.tax.service.gov.uk/hmrc-design-patterns/employer-paye-reference/},
 * which is formatted as follows:
 * - 3 numbers
 * - a forward slash ('/')
 * - between 1 and 10 characters, which can be letters and numbers
 */
export class HmrcPayeReference {
  private static readonly payeRefRegex = /^[0-9]{3}\/[A-Z0-9]{1,10}$/;

  /**
   * Gets or sets the HMRC office number portion of the full PAYE Reference. Always 3 digits.
   */
  public hmrcOfficeNumber: number;

  /**
   * Gets or sets the PAYE reference portion of the full HMRC PAYE Reference, i.e., the portion on the right hand of '/'.
   */
  public employerPayeReference: string;

  /**
   * Initialises a new instance of HmrcPayeReference using the Office number and Employer PAYE reference
   * elements.
   * @param hmrcOfficeNumber HMRC Office Number (always 3 digits).
   * @param employerPayeReference Employer PAYE reference (the part after the '/').
   */
  constructor(hmrcOfficeNumber: number, employerPayeReference: string) {
    this.hmrcOfficeNumber = hmrcOfficeNumber;
    this.employerPayeReference = employerPayeReference;
  }

  /**
   * Operator for casting implicitly from a HmrcPayeReference instance to its string representation.
   * @param value An instance of HmrcPayeReference.
   */
  public static toString(value: HmrcPayeReference): string {
    return value.toString();
  }

  /**
   * Operator for casting implicitly from a string to a HmrcPayeReference.
   * @param value String representation of Hmrc PAYE reference.
   * @throws {Error} Thrown if the supplied string is not a valid PAYE reference.
   */
  public static fromString(value: string): HmrcPayeReference {
    return HmrcPayeReference.parse(value);
  }

  /**
   * Parses the supplied string into a HmrcPayeReference. If the supplied string cannot be parsed, then
   * an Error is thrown, except when the supplied string is null, then an Error is thrown.
   * @param input String value containing candidate full HMRC PAYE Reference. Lower case characters are converted to
   * upper case.
   * @returns A new HmrcPayeReference if a valid HMRC PAYE Reference was supplied.
   * @throws {Error} Thrown if null was supplied.
   * @throws {Error} Thrown if an invalid PAYE reference was supplied.
   */
  public static parse(input: string | null): HmrcPayeReference {
    if (input == null) throw new Error("PAYE reference may not be null");

    let payeReference = HmrcPayeReference.tryParse(input);
    if (payeReference) {
      return payeReference!;
    }

    throw new Error("PAYE reference is invalid");
  }

  /**
   * Attempts to parse the supplied string into an HmrcPayeReference object.
   * @param input String value containing candidate full HMRC PAYE Reference. Lower case characters are converted to
   * upper case.
   * @param payeReference Set to a new instance of HmrcPayeReference if parse succeeds; set to object default
   * otherwise.
   * @returns True if the string could be parsed into a valid HMRC PAYE Reference; false otherwise.
   */
  public static tryParse(input: string | null): HmrcPayeReference | null {
    if (!input) return null;

    const tidiedInput = input.toUpperCase().replaceAll(" ", "");

    if (!HmrcPayeReference.isValid(tidiedInput)) return null;

    const tokens = tidiedInput.split("/", 2);

    if (!tokens || tokens.length !== 2) {
      throw new Error(
        "Unexpected parsing error in HmrcPayeReference.tryParse()",
      );
    }

    return new HmrcPayeReference(parseInt(tokens[0], 10), tokens[1]);
  }

  /**
   * Verifies whether the supplied string could be a valid HMRC PAYE Reference.
   * @param value String value to check.
   * @returns True if the supplied value could be a valid HMRC PAYE Reference; false otherwise.
   * @remarks Although this method confirms whether the string supplied could be a valid HMRC PAYE Reference,
   * it does not guarantee that the supplied value is registered with HMRC against a given company.
   */
  public static isValid(value: string | null): boolean {
    return value != null && HmrcPayeReference.payeRefRegex.test(value);
  }

  /**
   * Gets the string representation of this HmrcPayeReference.
   * @returns The value of this HmrcPayeReference as a string.
   */
  public toString(): string {
    return `${this.hmrcOfficeNumber.toString().padStart(3, "0")}/${this.employerPayeReference}`;
  }
}
