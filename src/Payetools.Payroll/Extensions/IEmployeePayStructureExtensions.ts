// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import {
  PayFrequency,
  PayFrequencyExtensions,
} from "~/Payetools.Common/Model/PayFrequency";
import { IEmployeePayStructure } from "../Model/IEmployeePayStructure";
import { PayRateType } from "../Model/PayRateType";
import { PayRateUnits } from "../Model/PayRateUnits";
import { Money } from "@dintero/money";

/**
 * Extension methods for IEmployeePayStructure.
 */
export class EmployeePayStructureExtensions {
  /**
   * Calculates the pay for one period at the specified pay frequency.
   *
   * @param value IEmployeePayStructure instance.
   * @param payFrequency Pay frequency.
   * @returns Pay for the period.
   * @throws {Error} Thrown if the pay structure does not refer to an annually paid employee.
   */
  public static getPayForSinglePeriod(
    value: IEmployeePayStructure,
    payFrequency: PayFrequency,
  ): Money {
    if (value.payRateType !== PayRateType.Salaried) {
      throw new Error(
        "Pay for single period can only be calculated for annually paid employees",
      );
    }

    return value.payRate.divide(
      PayFrequencyExtensions.getStandardTaxPeriodCount(payFrequency),
    );
  }

  /**
   * Calculates the pay for the period based on the specified amount of time/unit. Currently only supports
   * hourly pay.
   *
   * @param value IEmployeePayStructure instance.
   * @param quantity Amount of time/unit to calculate pay for.
   * @param units Units for quantity.
   * @returns Pay for the period.
   * @throws {Error} Thrown if the pay rate type is not hourly paid or units specified are not per hour.
   */
  public static getPayForPeriod(
    value: IEmployeePayStructure,
    quantity: number,
    units: PayRateUnits,
  ): Money {
    if (
      value.payRateType !== PayRateType.HourlyPaid ||
      units !== PayRateUnits.PerHour
    ) {
      throw new Error(
        "Pay rate type must be hourly paid and units specified must be per hour",
      );
    }

    return value.payRate.multiply(quantity);
  }
}
