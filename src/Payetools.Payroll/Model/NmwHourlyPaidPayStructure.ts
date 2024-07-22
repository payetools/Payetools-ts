// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { INmwEvaluator } from "~/Payetools.NationalMinimumWage/INmwEvaluator";
import { IEarningsDetails } from "./IEarningsDetails";
import { IEmployeePayStructure } from "./IEmployeePayStructure";
import { PayRateType } from "./PayRateType";
import { DateOnlyExtensions } from "~/Payetools.Common/Extensions/DateOnlyExtensions";
import { CalendarDate } from "calendar-date";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents an hourly paid pay structure that tracks National Minimum/Living Wage
 * levels.
 */
export class NmwHourlyPaidPayStructure implements IEmployeePayStructure {
  /** @inheritdoc */
  public id: string = "";

  /** @inheritdoc */
  public payRate: Money = zeroGbp;

  /** @inheritdoc */
  public get payRateType(): PayRateType {
    return PayRateType.HourlyPaid;
  }

  /** @inheritdoc */
  public payComponent: IEarningsDetails = {} as IEarningsDetails;

  /**
   * Updates the payRate based on the applicable NMW/NLW wage rate for the employee
   * using their age at the start of the pay period.
   *
   * @param nmwEvaluator - Instance of INmwEvaluator used to obtain the appropriate rate.
   * @param payPeriod - Pay period pertaining.
   * @param dateOfBirth - Employee's date of birth.
   */
  public updateNmw(
    nmwEvaluator: INmwEvaluator,
    payPeriod: DateRange,
    dateOfBirth: CalendarDate,
  ): void {
    const age = DateOnlyExtensions.ageAt(dateOfBirth, payPeriod.start);

    this.payRate = nmwEvaluator.getNmwHourlyRateForEmployee(age);
  }
}
