// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import Big from "big.js";
import { JsonConverter, JsonCustomConvert } from "json2typescript";

@JsonConverter
export class BigJsonConverter implements JsonCustomConvert<Big | null> {
  /**
   * Reads a Big value in string format and converts to the appropriate value.
   * @param value The string value to convert.
   * @returns The Big value.
   */
  deserialize(value: string | number | null): Big | null {
    return value != null ? Big(value) : Big(0);
  }

  /**
   * Writes a Big value, converted to its string equivalent.
   * @param value The value to convert.
   * @returns The string representation of the value.
   */
  serialize(value: Big | null): number | null {
    return value != null ? value.toNumber() : null;
  }
}
