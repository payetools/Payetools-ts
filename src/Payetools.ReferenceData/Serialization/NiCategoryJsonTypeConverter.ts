// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";

@JsonConverter
export class NiCategoryJsonConverter
  implements JsonCustomConvert<NiCategory | NiCategory[]>
{
  /**
   * Reads a NiCategory enumerated value in string format and converts to the appropriate enum value.
   * @param value The string value to convert.
   * @returns The NiCategory value.
   */
  deserialize(value: string | string[]): NiCategory | NiCategory[] {
    if (!Array.isArray(value)) {
      return NiCategory[value as keyof typeof NiCategory];
    }
    const result = value.map((x) => NiCategory[x as keyof typeof NiCategory]);
    return result;
  }

  /**
   * Writes a NiCategory enum value, converted to its string equivalent.
   * @param value The enum value to convert.
   * @returns The string representation of the enum value.
   */
  serialize(value: NiCategory | NiCategory[]): string | string[] {
    if (!Array.isArray(value)) {
      return NiCategory[value];
    }
    return value.map((x) => x.toString());
  }
}
