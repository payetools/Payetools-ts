// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export interface IPayRunInfoTestDataEntry {
  definitionVersion: string;
  testIdentifier: string;
  taxYearEnding: TaxYearEnding;
  testReference: string;
  payDay: CalendarDate;
  payPeriodStart: CalendarDate;
  payPeriodEnd: CalendarDate;
  payFrequency: PayFrequency;
}
