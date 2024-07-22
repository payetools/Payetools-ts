// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { PayDate } from "~/Payetools.Common/Model/PayDate";

/**
 * Represents key details about a given payrun.
 */
export class PayRunDetails {
  /**
   * Gets the PayDate for this payrun, which provides access to the pay date and the pay frequency.
   */
  public readonly payDate: PayDate;

  /**
   * Gets the start and end dates of the pay period that pertains to this payrun, in the form of a DateRange.
   */
  public readonly payPeriod: DateRange;

  /**
   * Initializes a new instance of the PayRunDetails class.
   * @param payDate Pay date.
   * @param payPeriod Pay period.
   */
  constructor(payDate: PayDate, payPeriod: DateRange) {
    this.payDate = payDate;
    this.payPeriod = payPeriod;
  }
}
