// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { INamedPerson } from "~/Payetools.Common/Model/INamedPerson";
import { NiNumber } from "~/Payetools.Common/Model/NiNumber";

/**
 * Interface that provides access to information about an employee's partner, typically used in
 * Shared Parental Leave/Pay scenarios.
 */
export interface IEmployeePartnerDetails {
  /**
   * Gets the name information (first name, last name, etc.) of the employee's partner.
   */
  nameInfo: INamedPerson;

  /**
   * Gets the National Insurance number of the employee.
   */
  niNumber: NiNumber;
}
