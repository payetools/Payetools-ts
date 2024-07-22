// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { Money } from "@dintero/money";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";

export interface IHmrcIncomeTaxTestDataEntry {
  /**
   * @property {string} definitionVersion
   */
  definitionVersion: string;

  /**
   * @property {string} testIdentifier
   */
  testIdentifier: string;

  /**
   * @property {TaxYearEnding} taxYearEnding
   */
  taxYearEnding: TaxYearEnding;

  /**
   * @property {string} relatesTo
   */
  relatesTo: string;

  /**
   * @property {PayFrequency} payFrequency
   */
  payFrequency: PayFrequency;

  /**
   * @property {Money} grossPay
   */
  grossPay: Money;

  /**
   * @property {Money} taxablePayToDate
   */
  taxablePayToDate: Money;

  /**
   * @property {string} taxCode
   */
  taxCode: string;

  /**
   * @property {string | null} w1M1Flag
   */
  w1M1Flag?: string;

  /**
   * @property {number} period
   */
  period: number;

  /**
   * @property {Money} taxDueInPeriod
   */
  taxDueInPeriod: Money;

  /**
   * @property {Money} taxDueToDate
   */
  taxDueToDate: Money;
}
