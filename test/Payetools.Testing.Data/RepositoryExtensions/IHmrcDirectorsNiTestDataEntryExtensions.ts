// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IHmrcDirectorsNiTestDataEntry } from "../NationalInsurance/IHmrcDirectorsNiTestDataEntry";

export function toDebugString(entry: IHmrcDirectorsNiTestDataEntry): string {
  return (
    `{ TestIdentifier: '${entry.testIdentifier}', ` +
    `PayFrequency: ${entry.payFrequency}, ` +
    `Period: ${entry.period}, ` +
    `GrossPay: ${entry.grossPay}, ` +
    `EmployeeNiContribution: ${entry.employeeNiContribution}, ` +
    `EmployerNiContribution: ${entry.employerNiContribution} }`
  );
}
