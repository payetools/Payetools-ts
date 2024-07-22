// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { Gender } from "~/Payetools.Common/Model/Gender";
import { INamedPerson } from "~/Payetools.Common/Model/INamedPerson";
import { NiNumber } from "~/Payetools.Common/Model/NiNumber";
import { PostalAddress } from "~/Payetools.Common/Model/PostalAddress";
import { IEmployeePartnerDetails } from "./IEmployeePartnerDetails";

/**
 * Interface that represents an employee for payroll purposes.
 */
export interface IEmployee extends INamedPerson {
  /**
   * Gets the individual's National Insurance number.
   */
  niNumber: NiNumber;

  /**
   * Gets the individual's date of birth.
   */
  dateOfBirth: CalendarDate;

  /**
   * Gets the individual's "official" gender as recognised by HMRC for payroll purposes.
   */
  gender: Gender;

  /**
   * Gets or sets the employee's email address, if known.
   */
  emailAddress?: string;

  /**
   * Gets or sets the employee's postal address.
   */
  postalAddress: PostalAddress;

  /**
   * Gets or sets the employee's passport number, if known.
   */
  passportNumber?: string;

  /**
   * Gets or sets the employee's partner information, where appropriate.
   */
  partnerDetails?: IEmployeePartnerDetails;
}
