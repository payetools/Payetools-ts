// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CalendarDate } from "calendar-date";
import { CountriesForTaxPurposes } from "./CountriesForTaxPurposes";
import { TaxYearEnding } from "./TaxYearEnding";
import { PayFrequency } from "./PayFrequency";
import { PayDate } from "./PayDate";
import { DateOnlyExtensions } from "../Extensions/DateOnlyExtensions";
import { ArgumentException } from "../Diagnostics/ArgumentException";
import { JsonObject, JsonProperty } from "json2typescript";
import { TaxYearEndingJsonConverter } from "../Serialization/TaxYearEndingJsonConverter";
import { DateOnlyJsonConverter } from "../Serialization/DateOnlyJsonConverter";

@JsonObject("TaxYear")
export class TaxYear {
  private static readonly DefaultCountriesBefore6Apr2020: CountriesForTaxPurposes =
    CountriesForTaxPurposes.England |
    CountriesForTaxPurposes.Wales |
    CountriesForTaxPurposes.NorthernIreland;

  private static readonly DefaultCountriesFrom6Apr2020: CountriesForTaxPurposes =
    CountriesForTaxPurposes.England | CountriesForTaxPurposes.NorthernIreland;

  private static readonly CountriesForBefore6Apr2020: CountriesForTaxPurposes[] =
    [TaxYear.DefaultCountriesBefore6Apr2020, CountriesForTaxPurposes.Scotland];

  private static readonly CountriesForFrom6Apr2020: CountriesForTaxPurposes[] =
    [
      TaxYear.DefaultCountriesFrom6Apr2020,
      CountriesForTaxPurposes.Wales,
      CountriesForTaxPurposes.Scotland,
    ];

  @JsonProperty("TaxYearEnding", TaxYearEndingJsonConverter)
  public taxYearEnding: TaxYearEnding = TaxYearEnding.Unspecified;

  @JsonProperty("StartOfTaxYear", DateOnlyJsonConverter)
  public startOfTaxYear: CalendarDate = CalendarDate.nowUTC();

  @JsonProperty("EndOfTaxYear", DateOnlyJsonConverter)
  public endOfTaxYear: CalendarDate = CalendarDate.nowUTC();

  public static fromTaxYearEnding(
    taxYearEnding: TaxYearEnding | CalendarDate,
  ): TaxYear {
    const result = new TaxYear();

    if (taxYearEnding instanceof CalendarDate) {
      taxYearEnding = DateOnlyExtensions.toTaxYearEnding(taxYearEnding);
    }

    result.taxYearEnding = taxYearEnding;
    result.startOfTaxYear = new CalendarDate(result.taxYearEnding - 1, 4, 6);
    result.endOfTaxYear = new CalendarDate(result.taxYearEnding, 4, 5);

    return result;
  }

  public static get current(): TaxYearEnding {
    return DateOnlyExtensions.toTaxYearEnding(CalendarDate.nowLocal());
  }

  public getCountriesForYear(): CountriesForTaxPurposes[] {
    switch (this.taxYearEnding) {
      case TaxYearEnding.Unspecified:
        throw new Error("Unable to verify countries for unspecified tax year");
      case TaxYearEnding.Apr5_2019:
        return TaxYear.CountriesForBefore6Apr2020;
      default:
        return TaxYear.CountriesForFrom6Apr2020;
    }
  }

  public isValidForYear(countries: CountriesForTaxPurposes): boolean {
    const countriesForYear = this.getCountriesForYear();
    return countriesForYear.includes(countries);
  }

  public getTaxPeriod(
    payDate: CalendarDate,
    payFrequency: PayFrequency,
  ): number {
    if (payDate < this.startOfTaxYear || payDate > this.endOfTaxYear) {
      throw new ArgumentException(
        `Pay date of ${DateOnlyExtensions.toUk(payDate)} is outside this tax year ${DateOnlyExtensions.toUk(this.startOfTaxYear)} - ${DateOnlyExtensions.toUk(this.endOfTaxYear)}`,
        "payDate",
      );
    }

    switch (payFrequency) {
      case PayFrequency.Annually:
        return 1;
      case PayFrequency.Monthly:
        return this.getMonthNumber(payDate, PayFrequency.Monthly);
      case PayFrequency.Quarterly:
        return (
          Math.floor(
            (this.getMonthNumber(payDate, PayFrequency.Monthly) - 1) / 3,
          ) + 1
        );
      case PayFrequency.BiAnnually:
        return (
          Math.floor(
            (this.getMonthNumber(payDate, PayFrequency.Monthly) - 1) / 6,
          ) + 1
        );
      default:
        const dayCountPerPeriod =
          payFrequency === PayFrequency.Weekly
            ? 7
            : payFrequency === PayFrequency.Fortnightly
              ? 14
              : payFrequency === PayFrequency.FourWeekly
                ? 28
                : (() => {
                    throw new Error(
                      `Invalid pay frequency value ${payFrequency}`,
                    );
                  })();
        //new Date()
        return Math.ceil(this.getDayNumber(payDate) / dayCountPerPeriod);
    }
  }

  public getDefaultCountriesForYear(): CountriesForTaxPurposes {
    switch (this.taxYearEnding) {
      case TaxYearEnding.Unspecified:
        throw new Error(
          "Unable to retrieve default countries for uninitialised tax year",
        );
      case TaxYearEnding.Apr5_2019:
        return TaxYear.DefaultCountriesBefore6Apr2020;
      default:
        return TaxYear.DefaultCountriesFrom6Apr2020;
    }
  }

  public getLastDayOfTaxPeriod(
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): CalendarDate {
    switch (payFrequency) {
      case PayFrequency.Weekly:
        return this.startOfTaxYear.addDays(7 * taxPeriod - 1);
      case PayFrequency.Fortnightly:
        return this.startOfTaxYear.addDays(14 * taxPeriod - 1);
      case PayFrequency.FourWeekly:
        return this.startOfTaxYear.addDays(28 * taxPeriod - 1);
      case PayFrequency.Monthly:
        return this.startOfTaxYear.addMonths(taxPeriod).addDays(-1);
      case PayFrequency.Quarterly:
        return this.startOfTaxYear.addMonths(taxPeriod * 3).addDays(-1);
      case PayFrequency.BiAnnually:
        return this.startOfTaxYear.addMonths(6 * taxPeriod).addDays(-1);
      case PayFrequency.Annually:
        return this.endOfTaxYear;
      default:
        throw new Error(`Invalid pay frequency value ${payFrequency}`);
    }
  }

  public getWeekNumber(
    payDate: CalendarDate,
    payFrequency: PayFrequency = PayFrequency.Weekly,
  ): number {
    const multiplier =
      payFrequency === PayFrequency.FourWeekly
        ? 4
        : payFrequency === PayFrequency.Fortnightly
          ? 2
          : payFrequency === PayFrequency.Weekly
            ? 1
            : 0;

    if (multiplier > 0) {
      return this.getTaxPeriod(payDate, payFrequency) * multiplier;
    } else {
      return Math.ceil(this.getDayNumber(payDate) / 7);
    }
  }

  public getMonthNumber(
    payDate: CalendarDate,
    payFrequency: PayFrequency,
  ): number {
    if (payDate < this.startOfTaxYear || payDate > this.endOfTaxYear)
      throw new ArgumentException(
        `Pay date of ${DateOnlyExtensions.toUk(payDate)} is outside this tax year ${DateOnlyExtensions.toUk(this.startOfTaxYear)} - ${DateOnlyExtensions.toUk(this.endOfTaxYear)}`,
        "payDate",
      );

    const startOfCalendarYear = new CalendarDate(this.taxYearEnding, 1, 1);
    const monthNumber =
      payDate.month +
      (payDate >= startOfCalendarYear && payDate <= this.endOfTaxYear
        ? 12
        : 0) -
      3;
    const dayOfMonth = payDate.day;

    const taxMonthNumber =
      monthNumber - (dayOfMonth >= 1 && dayOfMonth <= 5 ? 1 : 0);

    switch (payFrequency) {
      case PayFrequency.Annually:
        return 12;
      case PayFrequency.BiAnnually:
        return 6 + Math.floor((taxMonthNumber - 1) / 6) * 6;
      case PayFrequency.Quarterly:
        return 3 + Math.floor((taxMonthNumber - 1) / 3) * 3;
      default:
        return taxMonthNumber;
    }
  }

  public getMonthNumberForCalendarDate(payDate: CalendarDate): number {
    return this.getMonthNumber(payDate, PayFrequency.Monthly);
  }

  public getMonthNumberForPayDate(payDate: PayDate): number {
    return this.getMonthNumber(payDate.date, PayFrequency.Monthly);
  }

  private getDayNumber(payDate: CalendarDate): number {
    if (!(payDate >= this.startOfTaxYear && payDate <= this.endOfTaxYear)) {
      throw new ArgumentException(
        `Pay date of ${DateOnlyExtensions.toUk(payDate)} is outside this tax year ${DateOnlyExtensions.toUk(this.startOfTaxYear)} - ${DateOnlyExtensions.toUk(this.endOfTaxYear)}`,
        "payDate",
      );
    }

    return payDate.getDifferenceInDays(this.startOfTaxYear) + 1;
  }
}
