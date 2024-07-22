// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { INamedPerson } from "~/Payetools.Common/Model/INamedPerson";
import { NiNumber } from "~/Payetools.Common/Model/NiNumber";
import { Title } from "~/Payetools.Common/Model/Title";
import { IEmployeePartnerDetails } from "./IEmployeePartnerDetails";

class NamedPerson implements INamedPerson {
  public title?: Title;

  public firstName?: string;

  public initials?: string[];

  public middleNames?: string;

  public lastName: string;

  public knownAsName?: string;

  public get hasMiddleName(): boolean {
    return this.middleNames != null;
  }

  public get initialsAsString(): string | undefined {
    return this.initials != null ? this.initials.join(", ") : undefined;
  }

  constructor(
    title: Title | null,
    firstName: string | null,
    initials: string[] | null,
    middleNames: string | null,
    lastName: string,
    knownAsName: string | null = null,
  ) {
    this.title = title ?? undefined;
    this.firstName = firstName ?? undefined;
    this.initials = initials ?? undefined;
    this.middleNames = middleNames ?? undefined;
    this.lastName = lastName;
    this.knownAsName = knownAsName ?? undefined;
  }
}

/**
 * Entity that provides access to information about an employee's partner, typically used in
 * Shared Parental Leave/Pay scenarios.
 */
export class EmployeePartnerDetails implements IEmployeePartnerDetails {
  /**
   * Gets the name information (first name, last name, etc.) of the employee's partner.
   */
  public nameInfo: INamedPerson;

  /**
   * Gets the National Insurance number of the employee.
   */
  public niNumber: NiNumber;

  /**
   * Initializes a new instance of the `EmployeePartnerDetails` class.
   * @param title Partner title. Optional; supply null if not known.
   * @param firstName Partner first name.
   * @param middleNames Partner middle name(s), space separated. Optional.
   * @param lastName Partner last name.
   * @param niNumber Partner National Insurance number.
   * @remarks Initialising this type with partner initials rather than forenames is not currently supported.
   * @throws {Error} Thrown if less than one forename is supplied.
   */
  constructor(
    title: Title | null,
    firstName: string,
    middleNames: string | null,
    lastName: string,
    niNumber: NiNumber,
  ) {
    this.nameInfo = new NamedPerson(
      title,
      firstName,
      null,
      middleNames,
      lastName,
    );
    this.niNumber = niNumber;
  }
}
