// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { HmrcAccountsOfficeReference } from "~/Payetools.Common/Model/HmrcAccountsOfficeReference";
import { HmrcPayeReference } from "~/Payetools.Common/Model/HmrcPayeReference";
import { IBankAccount } from "./IBankAccount";
import { StateAidForEmploymentAllowance } from "./StateAidForEmploymentAllowance";

/**
 * Interface that represents an employer for payroll purposes.
 */
export interface IEmployer {
  /**
   * Gets the official or legal name of the business, including any official suffix, e.g., Ltd, LLP, etc.
   */
  officialName?: string;

  /**
   * Gets the name that the business is known by, omitting any official suffix, e.g., Ltd, LLP, etc.
   */
  knownAsName: string;

  /**
   * Gets the employer's HMRC PAYE reference, if known.
   */
  hmrcPayeReference?: HmrcPayeReference;

  /**
   * Gets the employer's HMRC Accounts Office reference, if known.
   */
  accountsOfficeReference?: HmrcAccountsOfficeReference;

  /**
   * Gets the employer's Corporation Tax reference, if known.
   */
  hmrcCorporationTaxReference?: string;

  /**
   * Gets a value indicating whether the employer is currently eligible for Employment Allowance.
   */
  isEligibleForEmploymentAllowance: boolean;

  /**
   * Gets the applicable state aid qualifier for employment allowance.
   */
  employmentAllowanceStateAidClassification?: StateAidForEmploymentAllowance;

  /**
   * Gets a value indicating whether the employer is eligible for Small Employers Relief.
   */
  isEligibleForSmallEmployersRelief: boolean;

  /**
   * Gets a value indicating whether the employer must pay the Apprentice Levy.
   */
  isApprenticeLevyDue: boolean;

  /**
   * Gets the annual allowance available to the employer if the Apprentice Levy is payable.
   */
  apprenticeLevyAllowance?: number;

  /**
   * Gets the employer's bank account used for HMRC refunds. May be null if unspecified.
   */
  bankAccount?: IBankAccount;
}
