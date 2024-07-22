// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ArgumentException } from "../Diagnostics/ArgumentException";

/**
 * Represents an individual's title (e.g., Mr., Mrs).
 *
 * Some ideas on standardisation sourced from
 * [https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1112942/Titles__V12_.pdf].
 *
 * As per general Government guidance, no attempt is made to deduce a person's gender from their title.
 */
export class Title {
  private static readonly _standardTitles: ReadonlyMap<string, string> =
    new Map([
      ["ms", "Ms"],
      ["miss", "Miss"],
      ["mr", "Mr"],
      ["mr.", "Mr"],
      ["mrs", "Mrs"],
      ["mrs.", "Mrs"],
      ["dr", "Dr."],
      ["dr.", "Dr."],
      ["doctor", "Dr."],
      ["rev", "Rev."],
      ["rev.", "Rev."],
      ["reverend", "Rev."],
      ["revd", "Rev."],
      ["revd.", "Rev."],
      ["prof", "Prof."],
      ["prof.", "Prof."],
      ["professor", "Prof."],
    ]);

  private readonly _title: string;

  private constructor(title: string) {
    this._title = title;
  }

  /**
   * Implicit cast from Title to string.
   * @param title Title to obtain the string representation of.
   */
  public toString(): string {
    return this._title ?? "";
  }

  /**
   * Implicit cast from string to Title.
   * @param title String title to obtain a Title instance for.
   * @throws {ArgumentException} Thrown if the title exceeds 35 characters in length.
   */
  public static fromString(title: string): Title | null {
    return Title.parse(title);
  }

  /**
   * Inspects the supplied title and returns a new `Title` instance holding either the
   * title supplied, or if it is a standard title (e.g., Mr, Mrs, Miss, etc.) then the standardised
   * form of that title.
   * @param title Externally supplied string value for title.
   * @returns Null if no title provided, a standardised title (e.g., "Mr") if a standardised title
   * is provided, or the supplied string otherwise.
   */
  public static parse(title: string | null): Title | null {
    if (!title || title.trim() === "") {
      return null;
    }

    const lowercaseTitle = title.toLowerCase();
    if (Title._standardTitles.has(lowercaseTitle)) {
      return new Title(Title._standardTitles.get(lowercaseTitle)!);
    }

    if (title.length > 35) {
      throw new ArgumentException(
        "Titles may not exceed 35 characters in length",
        "title",
      );
    }

    return new Title(title);
  }
}
