// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Title } from "./Title";

/**
 * Represents a named individual, i.e., a (usually living) person.  This interface is provided for all the situations
 * where a contact person is required, but is also the base entity for employees.
 */
export interface INamedPerson {
  /**
   * Gets the individual's title, e.g., Mr, Mrs, Miss, Dr., etc.
   */
  title?: Title;

  /**
   * Gets the individual's first (also known as "given" or "Christian") name.
   */
  firstName?: string;

  /**
   * Gets a list of the individual's initials as an array.  Note that this property is only used if the individual's
   * first name is not known, and its use is mutually exclusive with `firstName` and `middleNames`.
   */
  initials?: string[];

  /**
   * Gets the middle names of the individual, space separated.  Note that this property is optional, as some people do
   * not have middle names, or they choose not to disclose them.
   */
  middleNames?: string;

  /**
   * Gets the individual's last (also known as "family") name.
   */
  lastName: string;

  /**
   * Gets the name that an individual would like to be known as.  This might be an abbreviated form of their
   * first name (e.g., Geoff rather than Geoffrey) or just a nickname that they are commonly known by.  Optional.
   */
  knownAsName?: string;

  /**
   * Gets a value indicating whether the individual has supplied a middle name.
   */
  hasMiddleName: boolean;

  /**
   * Gets any initials provided as a space separated string.  Will be null if a `firstName`
   * has been provided.
   */
  initialsAsString?: string;
}
