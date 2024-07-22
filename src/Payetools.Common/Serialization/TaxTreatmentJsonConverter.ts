// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { TaxTreatment } from "~/Payetools.Common/Model/TaxTreatment";

@JsonConverter
export class TaxTreatmentJsonConverter
  implements JsonCustomConvert<TaxTreatment>
{
  /**
   * Reads a TaxTreatment enumerated value in string format and converts to the appropriate enum value.
   * @param value The string value to convert.
   * @returns The TaxTreatment value.
   */
  deserialize(value: string): TaxTreatment {
    return TaxTreatment[value as keyof typeof TaxTreatment];
  }

  /**
   * Writes a TaxTreatment enum value, converted to its string equivalent.
   * @param value The enum value to convert.
   * @returns The string representation of the enum value.
   */
  serialize(value: TaxTreatment): string {
    return value.toString();
  }
}
