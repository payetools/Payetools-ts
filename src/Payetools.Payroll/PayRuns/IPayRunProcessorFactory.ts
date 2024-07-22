// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { IPayRunDetails } from "../Model/IPayRunDetails";
import { IPayRunProcessor } from "./IPayRunProcessor";

/**
 * Interface that represents factory objects that create instances that implement IPayRunProcessor.
 */
export interface IPayRunProcessorFactory {
  /**
   * Gets a payrun processor for specified pay date and pay period.
   * @param payDate - Applicable pay date for the required payrun processor.
   * @param payPeriod - Applicable pay period for required payrun processor.
   * @returns An implementation of IPayRunProcessor for the specified pay date
   * and pay period.
   */
  getProcessor(payDate: PayDate, payPeriod: DateRange): IPayRunProcessor;

  /**
   * Gets a payrun processor for specified pay run details.
   * @param payRunDetails - Pay run details that provide applicable pay date and
   * pay period for the required payrun processor.
   * @returns An implementation of IPayRunProcessor for the specified pay date
   * and pay period.
   */
  getProcessorForPayRun(payRunDetails: IPayRunDetails): IPayRunProcessor;
}
