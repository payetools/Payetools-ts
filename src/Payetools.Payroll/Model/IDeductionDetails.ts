// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { DeductionType } from "./DeductionType";
import { PayRateUnits } from "./PayRateUnits";

/**
 * Interface that represents the various types of deduction that can be made from payroll.
 * As this type is used as the key to a dictionary in the {@link IDeductionsHistoryYtd} type,
 * it is recommended to override {@link Object.prototype.hashCode} in any implementations.
 */
export interface IDeductionDetails {
  /**
   * Gets the full name of this type of deduction.
   */
  name: string;

  /**
   * Gets the type of this deduction.
   */
  deductionType: DeductionType;

  /**
   * Gets the units for this deduction type, if applicable.  Null if not applicable.
   */
  units?: PayRateUnits;

  /**
   * Gets a value indicating whether this type of deduction reduces the gross pay figure used
   * to calculate take-home.
   */
  reducesGrossPay: boolean;

  /**
   * Gets a value indicating whether this type of deduction is applied before or after tax.
   */
  reducesTaxablePay: boolean;

  /**
   * Gets a value indicating whether this type of deduction affects pay for National Insurance
   * purposes.
   */
  reducesNicablePay: boolean;

  /**
   * Gets a value indicating whether this type of deduction affects pay for pension
   * purposes.
   */
  reducesPensionablePay: boolean;

  /**
   * Gets a value indicating whether this type of deduction is made as part of a salary exchange
   * (aka salary sacrifice) arrangement.  Note that when this flag is set, `reducesGrossPay`,
   * `reducesTaxablePay` and `reducesNicablePay` will also normally be
   * set to true.
   *
   * This property is primarily included to assist when it is time to show the deduction on the
   * payslip, enabling all salary exchange deductions including pensions to be grouped together.
   */
  isUnderSalaryExchangeArrangement: boolean;
}
