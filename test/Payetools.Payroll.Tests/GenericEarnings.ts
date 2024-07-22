// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IEarningsDetails } from "~/Payetools.Payroll/Model/IEarningsDetails";
import { PaymentType } from "~/Payetools.Payroll/Model/PaymentType";
import { PayRateUnits } from "~/Payetools.Payroll/Model/PayRateUnits";

/**
 * Represents a generic pay component (e.g., salary, bonus, sick pay, etc.).
 */
export class GenericEarnings implements IEarningsDetails {
  /**
   * Gets or sets the unique ID for this pay component.
   */
  id: string = "";

  /**
   * Gets or sets the short name for this pay component.
   */
  shortName: string = "";

  /**
   * Gets or sets the full name of this pay component.
   */
  name: string = "";

  /**
   * Gets the type of this payment.
   */
  paymentType: PaymentType = PaymentType.Unspecified;

  /**
   * Gets or sets the units for this pay component, if applicable. Null if not applicable.
   */
  units?: PayRateUnits = PayRateUnits.PerAnnum;

  /**
   * Gets or sets a value indicating whether this pay component is subject to tax.
   */
  isSubjectToTax: boolean = false;

  /**
   * Gets or sets a value indicating whether this pay component is subject to National Insurance.
   */
  isSubjectToNi: boolean = false;

  /**
   * Gets or sets a value indicating whether this pay component should be included in the employee's
   * pensionable salary.
   */
  isPensionable: boolean = false;

  /**
   * Gets or sets a value indicating whether this pay component refers to a net amount that should be
   * "grossed up", ensuring the employee receives the net amount in their take-home pay.
   */
  isNetToGross: boolean = false;

  /**
   * Gets or sets a value indicating whether this pay component should be treated as overtime for the
   * purposes of average overtime calculations.
   */
  isTreatedAsOvertime: boolean = false;
}
