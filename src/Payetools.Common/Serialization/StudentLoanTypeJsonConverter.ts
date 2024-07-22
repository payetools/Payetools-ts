// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { StudentLoanType } from "../Model/StudentLoanType";

@JsonConverter
export class StudentLoanTypeJsonConverter
  implements JsonCustomConvert<StudentLoanType>
{
  /**
   * Reads a StudentLoanType enumerated value in string format and converts to the appropriate enum value.
   * @param value The string value to convert.
   * @returns The StudentLoanType value.
   */
  deserialize(value: string): StudentLoanType {
    return StudentLoanType[value as keyof typeof StudentLoanType];
  }

  /**
   * Writes a StudentLoanType enum value, converted to its string equivalent.
   * @param value The enum value to convert.
   * @returns The string representation of the enum value.
   */
  serialize(value: StudentLoanType): string {
    return value.toString();
  }
}
