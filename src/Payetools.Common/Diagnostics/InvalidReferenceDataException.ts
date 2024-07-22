// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

// Exception that is thrown when invalid reference data is provided.
export class InvalidReferenceDataException extends Error {
  // Initialises a new instance of the InvalidReferenceDataException class.
  // @param message Human-readable text providing further details on the exception.
  constructor(message: string);
  constructor(message: string, innerException?: Error);
  constructor(message: string, innerException?: Error) {
    super(message);
    this.name = "InvalidReferenceDataException";
    if (innerException) {
      this.stack += `\nCaused by: ${innerException.stack}`;
    }
  }
}
