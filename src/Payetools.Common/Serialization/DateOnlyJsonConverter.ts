// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { JsonConverter, JsonCustomConvert } from "json2typescript";

@JsonConverter
export class DateOnlyJsonConverter implements JsonCustomConvert<CalendarDate> {
  /**
   * Reads a CalendarDate enumerated value in string format and converts to the appropriate enum value.
   * @param value The string value to convert.
   * @returns The CalendarDate value.
   */
  deserialize(value: string): CalendarDate {
    return CalendarDate.parse(value);
  }

  /**
   * Writes a CalendarDate enum value, converted to its string equivalent.
   * @param value The enum value to convert.
   * @returns The string representation of the enum value.
   */
  serialize(value: CalendarDate): string {
    return value.toString();
  }
}
