// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Enumeration that represents the different types of deductions that can be made from an employee's pay.
 */
export enum DeductionType {
  /**
   * Not defined.
   */
  Undefined,

  /**
   * Adjustment to pay, for example, repayment of previous earnings in error.
   */
  Adjustment,

  /**
   * Attachment of earnings payment.
   */
  AttachmentOfEarnings,
}
