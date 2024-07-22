// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { PayDate } from "~/Payetools.Common/Model/PayDate";

/**
 * Interface that represents the summary of a pay run.
 */
export interface IPayRunSummary {
  /**
   * Gets the pay date that this summary was paid on.
   */
  payDate: PayDate;

  /**
   * Gets the total amount of income tax for the pay run, if any. Zero otherwise.
   */
  incomeTaxTotal: Money;

  /**
   * Gets the total amount of student loan repayment for the pay run, if any. Zero otherwise.
   */
  studentLoansTotal: Money;

  /**
   * Gets the total amount of postgraduate loan repayment for the pay run, if any. Zero otherwise.
   */
  postgraduateLoansTotal: Money;

  /**
   * Gets the total amount of employer's National Insurance for the pay run, if any. Zero otherwise.
   */
  employerNiTotal: Money;

  /**
   * Gets the total amount employee's National Insurance for the pay run, if any. Zero otherwise.
   */
  employeeNiTotal: Money;

  /**
   * Gets the total Statutory Maternity Pay amount for the pay run, if any. Zero otherwise.
   */
  statutoryMaternityPayTotal: Money;

  /**
   * Gets the total Statutory Paternity Pay amount for the pay run, if any. Zero otherwise.
   */
  statutoryPaternityPayTotal: Money;

  /**
   * Gets the total Statutory Adoption Pay amount for the pay run, if any. Zero otherwise.
   */
  statutoryAdoptionPayTotal: Money;

  /**
   * Gets the total Statutory Shared Parental Pay amount for the pay run, if any. Zero otherwise.
   */
  statutorySharedParentalPayTotal: Money;

  /**
   * Gets the total Statutory Parental Bereavement Pay amount for the pay run, if any. Zero otherwise.
   */
  statutoryParentalBereavementPayTotal: Money;
}
