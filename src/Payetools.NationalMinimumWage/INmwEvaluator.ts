// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { NmwEvaluationResult } from "./NmwEvaluationResult";
import { CalendarDate } from "calendar-date";

/**
 * Interface for types that provide National Minimum/Living Wage evaluations.
 */
export interface INmwEvaluator {
  /**
   * Evaluates whether an employee's pay is compliant with the NMW/NLW regulations by considering their pay, hours and date of
   * birth. Note that apprentices have special treatment.
   *
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
    isApprentice?: boolean,
    yearsAsApprentice?: number | null,
  ): NmwEvaluationResult;

  /**
   * Gets the expected hourly rate of pay for an employee that is paid is the National Minimum or National Living Wage.
   *
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
    isApprentice?: boolean,
    yearsAsApprentice?: number | null,
  ): Money;
}
