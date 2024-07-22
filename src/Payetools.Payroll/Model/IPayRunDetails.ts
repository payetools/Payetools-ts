// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { PayDate } from "~/Payetools.Common/Model/PayDate";

/**
 * Interface that represents key details about a given payrun.
 */
export interface IPayRunDetails {
  /**
   * Gets the PayDate for this payrun, which provides access to the pay date and the pay frequency.
   */
  payDate: PayDate;

  /**
   * Gets the start and end dates of the pay period that pertains to this payrun, in the form of a DateRange.
   */
  payPeriod: DateRange;
}
