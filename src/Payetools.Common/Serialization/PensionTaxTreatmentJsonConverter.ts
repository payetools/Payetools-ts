// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";

@JsonConverter
export class PensionTaxTreatmentJsonConverter
  implements JsonCustomConvert<PensionTaxTreatment>
{
  /**
   * Reads a PensionTaxTreatment enumerated value in string format and converts to the appropriate enum value.
   * @param value The string value to convert.
   * @returns The PensionTaxTreatment value.
   */
  deserialize(value: string): PensionTaxTreatment {
    return PensionTaxTreatment[value as keyof typeof PensionTaxTreatment];
  }

  /**
   * Writes a PensionTaxTreatment enum value, converted to its string equivalent.
   * @param value The enum value to convert.
   * @returns The string representation of the enum value.
   */
  serialize(value: PensionTaxTreatment): string {
    return value.toString();
  }
}
