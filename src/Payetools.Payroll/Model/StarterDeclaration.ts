// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

/**
 * Represents a new employee's starter declaration, if provided. In the case of high earners, the
 * starter declaration may be omitted and the employee put on a 0T tax code rather than a BR or
 * "emergency tax code", in order to avoid paying insufficient tax.
 */
export enum StarterDeclaration {
  /**
   * HMRC: "This is my first job since 6 April and since the 6 April I have not received
   * payments from any of the following:
   * - Jobseeker's Allowance
   * - Employment and Support Allowance
   * - Incapacity Benefit
   */
  A,

  /**
   * HMRC: "Since 6 April I have had another job but I do not have a P45. And/or since
   * the 6 April I have received payments from any of the following:
   * - Jobseeker's Allowance
   * - Employment and Support Allowance
   * - Incapacity Benefit
   */
  B,

  /**
   * I have another job and/or I am in receipt of a State, workplace or private pension.
   */
  C,

  /**
   * No Starter Declaration captured as the employee is a high earner.
   */
  HighEarnerNotRecorded,
}
