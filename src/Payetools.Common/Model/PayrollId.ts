// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Represents a payroll ID (also known as a "worker ID", "payroll number", "works number") as reported to HMRC.
 * @remarks This type is meant to aid payroll ID changes. Further work required.
 */
class PayrollId {
  private readonly _payrollId: string;

  /**
   * Gets a value indicating whether this payroll ID is an update to a previously submitted payroll ID.
   */
  public readonly isUpdate: boolean;

  /**
   * Gets the previous payroll ID, where applicable.
   */
  public readonly previousPayrollId?: string;

  /**
   * Initialises a new instance of PayrollId with the supplied value.
   * @param payrollId Payroll ID value.
   * @param isUpdate True if this an update to a previously submitted payroll ID; false otherwise. Default is false.
   * @param previousPayrollId If isUpdate is set to true, then this parameter should be set to the previous payroll ID used.
   */
  constructor(
    payrollId: string,
    isUpdate: boolean = false,
    previousPayrollId?: string,
  ) {
    this._payrollId = payrollId;
    this.isUpdate = isUpdate;
    this.previousPayrollId = previousPayrollId;
  }

  /**
   * Operator for casting implicitly from a PayrollId instance to its string representation.
   * @param payrollId An instance of PayrollId.
   */
  public static toString(payrollId: PayrollId): string {
    return payrollId._payrollId;
  }

  /**
   * Operator for casting implicitly from a payroll ID string value to a PayrollId instance.
   * @param payrollId String representation of payroll ID.
   */
  public static fromString(payrollId: string): PayrollId {
    return new PayrollId(payrollId);
  }

  /**
   * Gets the Payroll ID value as a string.
   * @returns String representation of payroll ID.
   */
  toString(): string {
    return this._payrollId;
  }
}
