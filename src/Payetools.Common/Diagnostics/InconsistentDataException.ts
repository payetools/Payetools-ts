// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

// Exception that is thrown when inconsistent data is detected, for example, when a tax code regime is invalid for the
// tax year in question.
export class InconsistentDataException extends Error {
  // Initialises a new instance of the InconsistentDataException class.
  // @param message - Human-readable text providing further details on the exception.
  constructor(message: string) {
    super(message);
    this.name = "InconsistentDataException";
  }
}
