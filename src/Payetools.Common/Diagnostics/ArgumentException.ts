// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

export class ArgumentException extends Error {
  constructor(
    message: string,
    public paramName: string,
  ) {
    super(`${message} (Parameter '${paramName}')`);
    this.name = "ArgumentException";
  }
}
