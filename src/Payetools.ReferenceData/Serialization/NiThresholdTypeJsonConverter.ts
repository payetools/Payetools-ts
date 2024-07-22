// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { ArgumentException } from "~/Payetools.Common/Diagnostics/ArgumentException";
import { NiThresholdType } from "~/Payetools.NationalInsurance/Model/NiThresholdType";

@JsonConverter
export class NiThresholdTypeJsonConverter
  implements JsonCustomConvert<NiThresholdType>
{
  /**
   * Reads a NiThresholdType enumerated value in string format and converts to the appropriate enum value.
   * @param value The string value to convert.
   * @returns The NiThresholdType value.
   */
  deserialize(value: string): NiThresholdType {
    switch (value?.toLowerCase()) {
      case "lower earnings limit":
        return NiThresholdType.LEL;
      case "primary threshold":
        return NiThresholdType.PT;
      case "secondary threshold":
        return NiThresholdType.ST;
      case "freeport upper secondary threshold":
        return NiThresholdType.FUST;
      case "upper secondary threshold":
        return NiThresholdType.UST;
      case "apprentice upper secondary threshold":
        return NiThresholdType.AUST;
      case "veterans upper secondary threshold":
        return NiThresholdType.VUST;
      case "upper earnings limit":
        return NiThresholdType.UEL;
      case "directors primary threshold":
        return NiThresholdType.DPT;
      case "investment zone upper secondary threshold":
        return NiThresholdType.IZUST;
      default:
        throw new ArgumentException(
          `Unrecognised Ni threshold type value '${value}'`,
          "value",
        );
    }
  }

  /**
   * Writes a NiThresholdType enum value, converted to its string equivalent.
   * @param value The enum value to convert.
   * @returns The string representation of the enum value.
   */
  serialize(value: NiThresholdType): string {
    return value.toString();
  }
}
