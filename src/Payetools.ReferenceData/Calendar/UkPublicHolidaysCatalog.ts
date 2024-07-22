// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { JsonObject, JsonProperty } from "json2typescript";

/**
 * Represents a public holiday "event".
 */
@JsonObject("Event")
export class Event {
  /**
   * Gets the description of this public holiday event.
   */
  @JsonProperty("title", String)
  description: string = "";

  /**
   * Gets the date of this public holiday event.
   */
  @JsonProperty("date", String)
  date: string = "";

  /**
   * Gets any notes associated with this public holiday event.
   */
  @JsonProperty("notes", String)
  notes: string = "";

  /**
   * Gets a value indicating whether "bunting" for this public holiday event
   * is true or false.  Who knows what this means...
   */
  @JsonProperty("bunting", Boolean)
  bunting: boolean = false;
}

/**
 * Represents a data set of public holiday data for a specific country or countries within the UK.
 */
export class CountryEntry {
  /**
   * Gets the country division this data set applies to.
   */
  @JsonProperty("division", String)
  division: string = "";

  /**
   * Gets a list of public holiday "events" as an array.
   */
  @JsonProperty("events", [Event])
  events: Event[] = [];
}

/**
 * Used to deserialise the public holiday dataset from gov.uk available at {@link https://www.gov.uk/bank-holidays.json}.
 */
export class PublicHolidaysCatalog {
  /**
   * Gets the public holiday information for England and Wales.
   */
  @JsonProperty("england-and-wales", CountryEntry)
  englandAndWales: CountryEntry = new CountryEntry();

  /**
   * Gets the public holiday information for Scotland.
   */
  @JsonProperty("scotland", CountryEntry)
  scotland: CountryEntry = new CountryEntry();

  /**
   * Gets the public holiday information for Northern Ireland.
   */
  @JsonProperty("northern-ireland", CountryEntry)
  northernIreland: CountryEntry = new CountryEntry();
}
