// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { NiNumber } from "~/Payetools.Common/Model/NiNumber";
import { PostalAddress } from "~/Payetools.Common/Model/PostalAddress";
import { Title } from "~/Payetools.Common/Model/Title";
import { IEmployee } from "./IEmployee";
import { CalendarDate } from "calendar-date";
import { Gender } from "~/Payetools.Common/Model/Gender";
import { IEmployeePartnerDetails } from "./IEmployeePartnerDetails";

/**
 * Represents an employee for payroll purposes.
 */
export class Employee implements IEmployee {
  /**
   * Gets the individual's title, e.g., Mr, Mrs, Miss, Dr., etc.
   */
  title?: Title;

  /**
   * Gets the individual's first (also known as "given" or "Christian") name.
   */
  firstName?: string;

  /**
   * Gets a list of the individual's initials as an array. Note that this property is only used if the individual's
   * first name is not known, and its use is mutually exclusive with {@link firstName} and {@link middleNames}.
   */
  initials?: string[];

  /**
   * Gets the middle names of the individual, space separated. Note that this property is optional, as some people do
   * not have middle names, or they choose not to disclose them.
   */
  middleNames?: string;

  /**
   * Gets the individual's last (also known as "family") name.
   */
  lastName: string = "";

  /**
   * Gets the name that an individual would like to be known as. This might be an abbreviated form of their
   * first name (e.g., Geoff rather than Geoffrey) or just a nickname that they are commonly known by. Optional.
   */
  knownAsName?: string = "";

  /**
   * Gets a value indicating whether the individual has supplied a middle name.
   */
  get hasMiddleName(): boolean {
    return this.middleNames != null;
  }

  /**
   * Gets any initials provided as a space separated string. Will be null if a {@link firstName}
   * has been provided.
   */
  initialsAsString?: string;

  /**
   * Gets the individual's National Insurance number.
   */
  niNumber: NiNumber = new NiNumber(true);

  /**
   * Gets the individual's date of birth.
   */
  dateOfBirth: CalendarDate = CalendarDate.nowUTC();

  /**
   * Gets the individual's "official" gender as recognised by HMRC for payroll purposes.
   */
  gender: Gender = Gender.Unknown;

  /**
   * Gets or sets the employee's email address, if known.
   */
  emailAddress?: string;

  /**
   * Gets or sets the employee's postal address.
   */
  postalAddress: PostalAddress = new PostalAddress();

  /**
   * Gets or sets the employee's passport number, if known.
   */
  passportNumber?: string;

  /**
   * Gets or sets the employee's partner information, where appropriate.
   */
  partnerDetails?: IEmployeePartnerDetails;
}
