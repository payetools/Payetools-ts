// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { UkPostcode } from "./UkPostcode";

/**
 * Represents a postal address. If it is a UK address, `Postcode` should be supplied
 * and `ForeignCountry` set to null or omitted; if the address is non-UK, then Postcode should
 * be null and ForeignCountry should be provided.
 */
export class PostalAddress {
  /**
   * Gets the first line of the address.
   */
  public readonly addressLine1: string;

  /**
   * Gets the second line of the address.
   */
  public readonly addressLine2: string;

  /**
   * Gets the third line of the address.
   */
  public readonly addressLine3?: string;

  /**
   * Gets the fourth line of the address.
   */
  public readonly addressLine4?: string;

  /**
   * Gets the postcode (UK addresses only).
   */
  public readonly postcode?: UkPostcode;

  /**
   * Gets the foreign country (non-UK addresses only).
   */
  public readonly foreignCountry?: string;

  /**
   * Initializes a new instance of `PostalAddress`.
   * @param addressLine1 First line of the address. Mandatory.
   * @param addressLine2 Second line of the address. Mandatory.
   * @param addressLine3 Third line of the address. Optional, i.e., may be null.
   * @param addressLine4 Fourth line of the address. Optional, i.e., may be null.
   * @param postcode Postcode for UK addresses only. Should be set to null for overseas addresses.
   * @param foreignCountry Foreign country for overseas addresses. Optional; should be null or omitted for UK addresses.
   */
  constructor(
    addressLine1: string = "",
    addressLine2: string = "",
    addressLine3?: string,
    addressLine4?: string,
    postcode?: UkPostcode,
    foreignCountry?: string,
  ) {
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.addressLine3 = addressLine3;
    this.addressLine4 = addressLine4;
    this.postcode = postcode;
    this.foreignCountry = foreignCountry;
  }
}
