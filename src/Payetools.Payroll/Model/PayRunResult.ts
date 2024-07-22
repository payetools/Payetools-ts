// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { IEmployeePayRunInputEntry } from "./IEmployeePayRunInputEntry";
import { IEmployeePayRunResult } from "./IEmployeePayRunResult";
import { IEmployer } from "./IEmployer";
import { IPayRunDetails } from "./IPayRunDetails";
import { IPayRunResult } from "./IPayRunResult";
import { IPayRunSummary } from "./IPayRunSummary";
import { PaymentType } from "./PaymentType";
import { PayRunSummary } from "./PayRunSummary";
import { zeroGbp } from "~/CurrencyHelpers";

/**
 * Represents the output of a payrun.
 */
export class PayRunResult implements IPayRunResult {
  private readonly payRunInputs: IEmployeePayRunInputEntry[];

  /**
   * Gets the employer that this payrun refers to.
   */
  public employer: IEmployer;

  /**
   * Gets the pay date for this payrun.
   */
  public payRunDetails: IPayRunDetails;

  /**
   * Gets the list of employee payrun entries.
   */
  public employeePayRunResults: IEmployeePayRunResult[];

  /**
   * Initializes a new instance of the PayRunResult class.
   * @param employer Employer this pay run refers to.
   * @param payRunDetails Pay date and pay period.
   * @param payRunInputs Pay run inputs per employee.
   * @param employeePayRunResults Employee pay run results.
   */
  constructor(
    employer: IEmployer,
    payRunDetails: IPayRunDetails,
    payRunInputs: IEmployeePayRunInputEntry[],
    employeePayRunResults: IEmployeePayRunResult[],
  ) {
    this.employer = employer;
    this.payRunDetails = payRunDetails;
    this.payRunInputs = payRunInputs;
    this.employeePayRunResults = employeePayRunResults;
  }

  /**
   * Gets a summary of this pay run, providing totals for all statutory payments.
   * @param payRunSummary IPayRunSummary instance that provides summary figures.
   */
  public getPayRunSummary(payRunSummary: IPayRunSummary): void {
    const allEarnings = this.payRunInputs.flatMap((pri) => pri.earnings);

    payRunSummary = new PayRunSummary(
      this.payRunDetails.payDate,
      this.employeePayRunResults
        .map((r) => r.taxCalculationResult.finalTaxDue)
        .reduce((sum, current) => sum.add(current), zeroGbp),
      this.employeePayRunResults
        .map(
          (r) =>
            r.studentLoanCalculationResult?.studentLoanDeduction ?? zeroGbp,
        )
        .reduce((sum, current) => sum.add(current), zeroGbp),
      this.employeePayRunResults
        .map(
          (r) =>
            r.studentLoanCalculationResult?.postgraduateLoanDeduction ??
            zeroGbp,
        )
        .reduce((sum, current) => sum.add(current), zeroGbp),
      this.employeePayRunResults
        .map((r) => r.niCalculationResult.employerContribution)
        .reduce((sum, current) => sum.add(current), zeroGbp),
      this.employeePayRunResults
        .map((r) => r.niCalculationResult.employerContribution)
        .reduce((sum, current) => sum.add(current), zeroGbp),
      allEarnings
        .filter(
          (e) =>
            e.earningsDetails.paymentType === PaymentType.StatutoryMaternityPay,
        )
        .map((e) => e.totalEarnings)
        .reduce((sum, current) => sum.add(current), zeroGbp),
      allEarnings
        .filter(
          (e) =>
            e.earningsDetails.paymentType === PaymentType.StatutoryPaternityPay,
        )
        .map((e) => e.totalEarnings)
        .reduce((sum, current) => sum.add(current), zeroGbp),
      allEarnings
        .filter(
          (e) =>
            e.earningsDetails.paymentType === PaymentType.StatutoryAdoptionPay,
        )
        .map((e) => e.totalEarnings)
        .reduce((sum, current) => sum.add(current), zeroGbp),
      allEarnings
        .filter(
          (e) =>
            e.earningsDetails.paymentType ===
            PaymentType.StatutorySharedParentalPay,
        )
        .map((e) => e.totalEarnings)
        .reduce((sum, current) => sum.add(current), zeroGbp),
      allEarnings
        .filter(
          (e) =>
            e.earningsDetails.paymentType ===
            PaymentType.StatutoryParentalBereavementPay,
        )
        .map((e) => e.totalEarnings)
        .reduce((sum, current) => sum.add(current), zeroGbp),
    );
  }
}
