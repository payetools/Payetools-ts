// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { INmwEvaluator } from "./INmwEvaluator";
import { NmwEvaluationResult } from "./NmwEvaluationResult";
import { INmwLevelSet } from "./ReferenceData/INmwLevelSet";
import { CalendarDate } from "calendar-date";
import { DateOnlyExtensions } from "~/Payetools.Common/Extensions/DateOnlyExtensions";
import { Money } from "@dintero/money";
import { RoundDown } from "~/CurrencyHelpers";

/**
 * Represents a National Minimum/Living Wage evaluator that implements INmwEvaluator.
 */
export class NmwEvaluator implements INmwEvaluator {
  private readonly nmwLevels: INmwLevelSet;

  /**
   * Initializes a new instance of NmwEvaluator using the supplied set of levels.
   * @param nmwLevels - NMW/NLW levels to use.
   */
  constructor(nmwLevels: INmwLevelSet) {
    this.nmwLevels = nmwLevels;
  }

  /**
   * Evaluates whether an employee's pay is compliant with the NMW/NLW regulations by considering their pay, hours and date of
   * birth. Note that apprentices have special treatment.
   * @param payPeriod - Applicable pay period.
   * @param dateOfBirth - Employee's date of birth.
   * @param grossPay - Gross pay to be used for the evaluation. This pay should correspond to the number of hours worked
   * given in the subsequent parameter.
   * @param hoursWorkedForPay - Hours worked that corresponds to the gross pay figure supplied.
   * @param isApprentice - True if the employee is an apprentice; false otherwise. Optional, defaults to false.
   * @param yearsAsApprentice - Number of years an apprentice has served in their apprenticeship. May be a figure less
   * than one. Optional, defaults to null; not required if the employee is not an apprentice.
   * @returns An instance of NmwEvaluationResult that indicates whether the pay is compliant with the NMW/NLW
   * regulations.
   * @remarks As per https://www.gov.uk/hmrc-internal-manuals/national-minimum-wage-manual/nmwm03010,
   * the rate that applies to each worker depends on their age at the start of the pay reference period.
   */
  evaluate(
    payPeriod: DateRange,
    dateOfBirth: CalendarDate,
    grossPay: Big,
    hoursWorkedForPay: number,
    isApprentice: boolean = false,
    yearsAsApprentice: number | null = null,
  ): NmwEvaluationResult {
    let commentary: string = "";
    const age = this.getAgeAt(dateOfBirth, payPeriod.start);

    commentary += `Age at start of pay period = ${age}. `;

    if (
      isApprentice &&
      (age < 19 || (yearsAsApprentice != null && yearsAsApprentice < 1.0))
    ) {
      commentary += "Treated as apprentice ";
      commentary +=
        age < 19
          ? "under 19. "
          : "19 or over but in the first year of their apprenticeship. ";
    }

    const rateApplicable = this.getNmwHourlyRateForEmployee(
      age,
      isApprentice,
      yearsAsApprentice,
    );

    const hourlyRate = grossPay.div(hoursWorkedForPay);
    const isCompliant = hourlyRate.gte(rateApplicable.amount());

    commentary += isCompliant
      ? `Pay is compliant as gross pay per hour of ${hourlyRate.toFixed(4)} is greater than or equal to minimum NMW/NLW rate ${rateApplicable}`
      : `Pay is non-compliant as gross pay per hour of ${hourlyRate.toFixed(4)} is less than minimum NMW/NLW rate ${rateApplicable}`;

    return new NmwEvaluationResult(
      isCompliant,
      rateApplicable,
      age,
      commentary,
    );
  }

  /**
   * Gets the expected hourly rate of pay for an employee that is paid is the National Minimum or National Living Wage.
   * @param ageAtStartOfPeriod - Age at the start of the applicable pay period.
   * @param isApprentice - True if the employee is an apprentice; false otherwise. Optional, defaults to false.
   * @param yearsAsApprentice - Number of years an apprentice has served in their apprenticeship. May be a figure less
   * than one. Optional, defaults to null; not required if the employee is not an apprentice.
   * @returns Appropriate hourly rate of pay.
   * @remarks As per https://www.gov.uk/hmrc-internal-manuals/national-minimum-wage-manual/nmwm03010,
   * the rate that applies to each worker depends on their age at the start of the pay reference period.
   */
  getNmwHourlyRateForEmployee(
    ageAtStartOfPeriod: number,
    isApprentice: boolean = false,
    yearsAsApprentice: number | null = null,
  ): Money {
    // Apprentices are entitled to the apprentice rate if they’re either:
    //   - aged under 19
    //   - aged 19 or over and in the first year of their apprenticeship
    if (
      isApprentice &&
      (ageAtStartOfPeriod < 19 ||
        (yearsAsApprentice != null && yearsAsApprentice < 1.0))
    ) {
      return this.nmwLevels.apprenticeLevel;
    }

    if (ageAtStartOfPeriod < 18) {
      return this.nmwLevels.under18Level;
    } else if (ageAtStartOfPeriod >= 18 && ageAtStartOfPeriod <= 20) {
      return this.nmwLevels.age18To20Level;
    } else if (ageAtStartOfPeriod >= 21 && ageAtStartOfPeriod <= 22) {
      return this.nmwLevels.age21To22Level;
    } else {
      return this.nmwLevels.age23AndAboveLevel;
    }
  }

  /**
   * Helper function to calculate age at a given date.
   * @param dateOfBirth - Date of birth.
   * @param referenceDate - Reference date to calculate age at.
   * @returns Age at the reference date.
   */
  private getAgeAt(
    dateOfBirth: CalendarDate,
    referenceDate: CalendarDate,
  ): number {
    return DateOnlyExtensions.ageAt(dateOfBirth, referenceDate);
  }
}
