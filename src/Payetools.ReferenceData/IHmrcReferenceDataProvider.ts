// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ITaxReferenceDataProvider } from "~/Payetools.IncomeTax/ReferenceData/ITaxReferenceDataProvider";
import { INiReferenceDataProvider } from "~/Payetools.NationalInsurance/ReferenceData/INiReferenceDataProvider";
import { INmwReferenceDataProvider } from "~/Payetools.NationalMinimumWage/ReferenceData/INmwReferenceDataProvider";
import { IPensionsReferenceDataProvider } from "~/Payetools.Pensions/ReferenceData/IPensionsReferenceDataProvider";
import { IStudentLoanReferenceDataProvider } from "~/Payetools.StudentLoans/ReferenceData/IStudentLoanReferenceDataProvider";
import { IEmployerReferenceDataProvider } from "./Employer/IEmployerReferenceDataProvider";

/**
 * Interface that HMRC reference data providers must implement.
 */
export interface IHmrcReferenceDataProvider
  extends ITaxReferenceDataProvider,
    INiReferenceDataProvider,
    IPensionsReferenceDataProvider,
    INmwReferenceDataProvider,
    IStudentLoanReferenceDataProvider,
    IEmployerReferenceDataProvider {
  /**
   * Gets the human-readable 'health' of this reference data provider.
   */
  health: string;
}
