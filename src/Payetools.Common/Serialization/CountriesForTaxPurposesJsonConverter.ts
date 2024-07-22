// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonConverter, JsonCustomConvert } from "json2typescript";
import {
  CountriesForTaxPurposes,
  CountriesForTaxPurposesConverter,
} from "../Model/CountriesForTaxPurposes";

@JsonConverter
export class CountriesForTaxPurposesJsonConverter
  implements JsonCustomConvert<CountriesForTaxPurposes>
{
  /**
   * Reads a CountriesForTaxPurposes enumerated value in string format and converts to the appropriate enum value.
   * @param value The string value to convert.
   * @returns The CountriesForTaxPurposes value.
   */
  deserialize(value: string): CountriesForTaxPurposes {
    return CountriesForTaxPurposesConverter.toEnum(value);
  }

  /**
   * Writes a CountriesForTaxPurposes enum value, converted to its string equivalent.
   * @param value The enum value to convert.
   * @returns The string representation of the enum value.
   */
  serialize(value: CountriesForTaxPurposes): string {
    return CountriesForTaxPurposesConverter.toString(value);
  }
}
