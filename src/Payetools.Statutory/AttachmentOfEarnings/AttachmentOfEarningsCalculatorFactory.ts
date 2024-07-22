// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { AttachmentOfEarningsType } from "./AttachmentOfEarningsType";
import { IAttachmentOfEarningsCalculatorFactory } from "./IAttachmentOfEarningsCalculatorFactory";
import { IAttachmentOfEarningsCalculator } from "./IAttachmentOfEarningsCalculator";

/**
 * Factory that can generate IAttachmentOfEarningsCalculator implementations.
 */
export class AttachmentOfEarningsCalculatorFactory
  implements IAttachmentOfEarningsCalculatorFactory
{
  /**
   * Gets a new IAttachmentOfEarningsCalculator based on the specified pay date and ...
   * The pay date is provided in order to determine which ... to use, noting that these may change
   * in-year.
   *
   * @param payDate - Applicable pay date.
   * @param attachmentOfEarningsType - Attachment of earnings order type.
   * @returns A new calculator instance.
   */
  getCalculator(
    payDate: PayDate,
    attachmentOfEarningsType: AttachmentOfEarningsType,
  ): IAttachmentOfEarningsCalculator {
    throw new Error("Not implemented");
  }
}
