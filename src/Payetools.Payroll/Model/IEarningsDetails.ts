// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { PaymentType } from "./PaymentType";
import { PayRateUnits } from "./PayRateUnits";

/**
 * Interface that represents a pay component (e.g., salary, bonus, sick pay, etc.).
 * As this type is used as the key to a dictionary in the {@link IDeductionsHistoryYtd} type,
 * it is recommended to override {@link Object.prototype.hashCode} in any implementations.
 */
export interface IEarningsDetails {
  /**
   * Gets the full name of this pay component.
   */
  name: string;

  /**
   * Gets the type of this payment.
   */
  paymentType: PaymentType;

  /**
   * Gets the units for this pay component, if applicable.  Null if not applicable.
   */
  units?: PayRateUnits;

  /**
   * Gets a value indicating whether this pay component is subject to tax.
   */
  isSubjectToTax: boolean;

  /**
   * Gets a value indicating whether this pay component is subject to National Insurance.
   */
  isSubjectToNi: boolean;

  /**
   * Gets a value indicating whether this pay component should be included in the employee's
   * pensionable salary.
   */
  isPensionable: boolean;

  /**
   * Gets a value indicating whether this pay component refers to a net amount that should be
   * "grossed up", ensuring the employee receives the net amount in their take-home pay.
   */
  isNetToGross: boolean;

  /**
   * Gets a value indicating whether this pay component should be treated as overtime for the
   * purposes of average overtime calculations.
   */
  isTreatedAsOvertime: boolean;
}
