// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { gbp } from "~/CurrencyHelpers";

@JsonConverter
export class MoneyJsonConverter implements JsonCustomConvert<Money | null> {
  /**
   * Reads a Money value in string format and converts to the appropriate value.
   * @param value The string value to convert.
   * @returns The Money value.
   */
  deserialize(value: string | number): Money {
    return gbp(value);
  }

  /**
   * Writes a Money value, converted to its string equivalent.
   * @param value The value to convert.
   * @returns The string representation of the value.
   */
  serialize(value: Money): number {
    return value.toNumber();
  }
}
