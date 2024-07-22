// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

// Interface that represents a UK bank account.
export interface IBankAccount {
  // Gets the account holder name.
  accountName: string;

  // Gets the account number. Should be 8 characters, all numeric, with leading zeroes where appropriate.
  accountNumber: string;

  // Gets the sort code for the account. Should be 6 characters, all numeric, with leading zeroes where appropriate.
  sortCode: string;

  // Gets the optional building society reference, where appropriate.
  buildingSocietyReference?: string;
}
