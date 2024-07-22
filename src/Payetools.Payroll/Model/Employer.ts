// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { HmrcAccountsOfficeReference } from "~/Payetools.Common/Model/HmrcAccountsOfficeReference";
import { HmrcPayeReference } from "~/Payetools.Common/Model/HmrcPayeReference";
import { IBankAccount } from "./IBankAccount";
import { IEmployer } from "./IEmployer";
import { StateAidForEmploymentAllowance } from "./StateAidForEmploymentAllowance";

/**
 * Represents an employer for payroll purposes.
 */
export class Employer implements IEmployer {
  /**
   * Gets the legal name of the business, including any legally required suffix, e.g., Ltd, LLP, etc.
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
  isApprenticeLevyDue: boolean = false;

  /**
   * Gets the annual allowance available to the employer if the Apprentice Levy is payable.
   */
  apprenticeLevyAllowance?: number;

  /**
   * Gets the employer's bank account used for HMRC refunds. May be null if unspecified.
   */
  bankAccount?: IBankAccount;

  /**
   * Initialises a new Employer with the supplied parameters.
   * @param officialName Legal name of the business, including any legally required suffix, e.g., Ltd, LLP, etc.
   * @param knownAsName Name that the business is known by, omitting any official suffix, e.g., Ltd, LLP, etc.
   * @param hmrcPayeReference Employer's HMRC PAYE reference, if known. Optional.
   * @param accountsOfficeReference Employer's HMRC Accounts Office reference, if known. Optional.
   * @param corporationTaxReference Employer's HMRC Corporation Tax reference, if known. Optional.
   * @param isEligibleForEmploymentAllowance Indicates whether the employer is currently eligible to claim Employment Allowance. Defaults to false.
   * @param employmentAllowanceStateAidClassification Where applicable, the employer's classification in terms of state aid. Defaults to none (null).
   * @param isEligibleForSmallEmployersRelief Indicates whether the employer is currently eligible to claim Small Employers Relief. Defaults to false.
   * @param bankAccount Employer's bank account details to be used in the case of HMRC refunds/repayments. Defaults to none (null).
   */
  constructor(
    officialName: string | null,
    knownAsName: string,
    hmrcPayeReference: HmrcPayeReference | null = null,
    accountsOfficeReference: HmrcAccountsOfficeReference | null = null,
    corporationTaxReference: string | null = null,
    isEligibleForEmploymentAllowance: boolean = false,
    employmentAllowanceStateAidClassification: StateAidForEmploymentAllowance | null = null,
    isEligibleForSmallEmployersRelief: boolean = false,
    bankAccount: IBankAccount | null = null,
  ) {
    this.officialName = officialName ?? undefined;
    this.knownAsName = knownAsName;
    this.hmrcPayeReference = hmrcPayeReference ?? undefined;
    this.accountsOfficeReference = accountsOfficeReference ?? undefined;
    this.hmrcCorporationTaxReference = corporationTaxReference ?? undefined;
    this.isEligibleForEmploymentAllowance = isEligibleForEmploymentAllowance;
    this.employmentAllowanceStateAidClassification =
      employmentAllowanceStateAidClassification ?? undefined;
    this.isEligibleForSmallEmployersRelief = isEligibleForSmallEmployersRelief;
    this.bankAccount = bankAccount ?? undefined;
  }
}
