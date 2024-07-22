// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Interface that types should implement to communicate an amount that is either fixed or calculated
 * as a product of quantity in units and per unit rate.
 */
export interface IPayrollAmount {
  /**
   * Gets the quantity of this deduction that when multiplied by the {@link valuePerUnit} gives the total amount.
   */
  quantityInUnits?: number;

  /**
   * Gets the GBP value per unit that when multiplied by the {@link quantityInUnits} gives the total deduction.
   */
  valuePerUnit?: number;

  /**
   * Gets the fixed amount of the deduction, if that is specified in place of quantity and value per unit. Used for absolute
   * amounts.
   */
  fixedAmount?: number;

  /**
   * Gets the total amount to be applied (default implementation).
   */
  getTotalDeduction(): number;
}

export class PayrollAmount implements IPayrollAmount {
  quantityInUnits?: number;
  valuePerUnit?: number;
  fixedAmount?: number;

  getTotalDeduction(): number {
    return (
      this.fixedAmount ?? (this.quantityInUnits ?? 0) * (this.valuePerUnit ?? 0)
    );
  }
}
