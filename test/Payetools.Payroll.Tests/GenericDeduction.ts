// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { DeductionType } from "~/Payetools.Payroll/Model/DeductionType";
import { IDeductionDetails } from "~/Payetools.Payroll/Model/IDeductionDetails";
import { PayRateUnits } from "~/Payetools.Payroll/Model/PayRateUnits";

/**
 * Represents the various types of deduction that can be made from payroll.
 */
export class GenericDeduction implements IDeductionDetails {
  /**
   * Gets or sets the short name for this type of deduction.
   */
  shortName: string = "";

  /**
   * Gets or sets the full name of this type of deduction.
   */
  name: string = "";

  /**
   * Gets the type of this deduction.
   */
  readonly deductionType: DeductionType = DeductionType.Undefined;

  /**
   * Gets or sets the units for this deduction type, if applicable. Null if not applicable.
   */
  units?: PayRateUnits;

  /**
   * Gets a value indicating whether this type of deduction reduces the gross pay figure used
   * to calculate take-home.
   */
  readonly reducesGrossPay: boolean = false;

  /**
   * Gets or sets a value indicating whether this type of deduction is applied before or after tax.
   */
  reducesTaxablePay: boolean = false;

  /**
   * Gets or sets a value indicating whether this type of deduction affects pay for National Insurance
   * purposes.
   */
  reducesNicablePay: boolean = false;

  /**
   * Gets or sets a value indicating whether this type of deduction affects pay for pension
   * purposes.
   */
  reducesPensionablePay: boolean = false;

  /**
   * Gets or sets a value indicating whether this type of deduction is made as part of a salary exchange
   * (aka salary sacrifice) arrangement. Note that when this flag is set, reducesGrossPay,
   * reducesTaxablePay and reducesNicablePay will also normally be set to true.
   *
   * This property is primarily included to assist when it is time to show the deduction on the
   * payslip, enabling all salary exchange deductions including pensions to be grouped together.
   */
  isUnderSalaryExchangeArrangement: boolean = false;
}
