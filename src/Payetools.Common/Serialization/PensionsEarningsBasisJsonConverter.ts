// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";

@JsonConverter
export class PensionsEarningsBasisJsonConverter
  implements JsonCustomConvert<PensionsEarningsBasis>
{
  /**
   * Reads a PensionsEarningsBasis enumerated value in string format and converts to the appropriate enum value.
   * @param value The string value to convert.
   * @returns The PensionsEarningsBasis value.
   */
  deserialize(value: string): PensionsEarningsBasis {
    return PensionsEarningsBasis[value as keyof typeof PensionsEarningsBasis];
  }

  /**
   * Writes a PensionsEarningsBasis enum value, converted to its string equivalent.
   * @param value The enum value to convert.
   * @returns The string representation of the enum value.
   */
  serialize(value: PensionsEarningsBasis): string {
    return value.toString();
  }
}
