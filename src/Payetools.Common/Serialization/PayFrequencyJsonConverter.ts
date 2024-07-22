// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { PayFrequency } from "../Model/PayFrequency";

@JsonConverter
export class PayFrequencyJsonConverter
  implements JsonCustomConvert<PayFrequency>
{
  /**
   * Reads a PayFrequency enumerated value in string format and converts to the appropriate enum value.
   * @param value The string value to convert.
   * @returns The PayFrequency value.
   */
  deserialize(value: string): PayFrequency {
    return PayFrequency[value as keyof typeof PayFrequency];
  }

  /**
   * Writes a PayFrequency enum value, converted to its string equivalent.
   * @param value The enum value to convert.
   * @returns The string representation of the enum value.
   */
  serialize(value: PayFrequency): string {
    return value.toString();
  }
}
