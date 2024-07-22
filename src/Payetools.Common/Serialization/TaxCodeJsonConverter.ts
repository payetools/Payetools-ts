// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonConvert, JsonConverter, JsonCustomConvert } from "json2typescript";
import { TaxCode } from "../Model/TaxCode";

@JsonConverter
export class TaxCodeJsonConverter implements JsonCustomConvert<TaxCode> {
  _jsonConvert = new JsonConvert();

  /**
   * Reads a TaxCode enumerated value in string format and converts to the appropriate enum value.
   * @param value The string value to convert.
   * @returns The TaxCode value.
   */
  deserialize(value: object): TaxCode {
    return this._jsonConvert.deserializeObject<TaxCode>(value, TaxCode);
  }

  /**
   * Writes a TaxCode enum value, converted to its string equivalent.
   * @param value The enum value to convert.
   * @returns The string representation of the enum value.
   */
  serialize(value: TaxCode): object {
    return this._jsonConvert.serializeObject(value);
  }
}
