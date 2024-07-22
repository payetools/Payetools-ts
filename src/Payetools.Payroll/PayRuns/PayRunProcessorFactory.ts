// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { ITaxCalculatorFactory } from "~/Payetools.IncomeTax/ITaxCalculatorFactory";
import { TaxCalculatorFactory } from "~/Payetools.IncomeTax/TaxCalculatorFactory";
import { INiCalculatorFactory } from "~/Payetools.NationalInsurance/INiCalculatorFactory";
import { NiCalculatorFactory } from "~/Payetools.NationalInsurance/NiCalculatorFactory";
import { IHmrcReferenceDataProvider } from "~/Payetools.ReferenceData/IHmrcReferenceDataProvider";
import { AttachmentOfEarningsCalculatorFactory } from "~/Payetools.Statutory/AttachmentOfEarnings/AttachmentOfEarningsCalculatorFactory";
import { IAttachmentOfEarningsCalculatorFactory } from "~/Payetools.Statutory/AttachmentOfEarnings/IAttachmentOfEarningsCalculatorFactory";
import { IStudentLoanCalculatorFactory } from "~/Payetools.StudentLoans/IStudentLoanCalculatorFactory";
import { StudentLoanCalculatorFactory } from "~/Payetools.StudentLoans/StudentLoanCalculatorFactory";
import { IPayRunDetails } from "../Model/IPayRunDetails";
import { IPayRunProcessor } from "./IPayRunProcessor";
import { IPayRunProcessorFactory } from "./IPayRunProcessorFactory";
import { PayRunEntryProcessor } from "./PayRunEntryProcessor";
import { PayRunProcessor } from "./PayRunProcessor";
import { IPensionContributionCalculatorFactory } from "~/Payetools.Pensions/IPensionContributionCalculatorFactory";
import { PensionContributionCalculatorFactory } from "~/Payetools.Pensions/PensionContributionCalculatorFactory";
import { IHmrcReferenceDataProviderFactory } from "~/Payetools.ReferenceData/IHmrcReferenceDataProviderFactory";

/**
 * Represents a factory object that creates payrun calculator instances that implement {@link IPayRunEntryProcessor}.
 */
export class PayRunProcessorFactory implements IPayRunProcessorFactory {
  private _hmrcReferenceDataProviderFactory?: IHmrcReferenceDataProviderFactory;
  private _hmrcReferenceDataProvider?: IHmrcReferenceDataProvider;
  private _referenceDataEndpoint?: URL;

  /**
   * Initialises a new instance of {@link PayRunProcessorFactory}.
   * @param hmrcReferenceDataProvider HMRC reference data provider.
   */
  constructor(hmrcReferenceDataProvider: IHmrcReferenceDataProvider);
  /**
   * Initialises a new instance of {@link PayRunProcessorFactory}.
   * @param hmrcReferenceDataProviderFactory HMRC reference data provider factory.
   * @param referenceDataEndpoint HTTP(S) endpoint to retrieve reference data from.
   */
  constructor(
    hmrcReferenceDataProviderFactory: IHmrcReferenceDataProviderFactory,
    referenceDataEndpoint: URL,
  );
  constructor(
    hmrcReferenceDataProviderOrFactory:
      | IHmrcReferenceDataProvider
      | IHmrcReferenceDataProviderFactory,
    referenceDataEndpoint?: URL,
  ) {
    if (referenceDataEndpoint) {
      this._hmrcReferenceDataProviderFactory =
        hmrcReferenceDataProviderOrFactory as IHmrcReferenceDataProviderFactory;
      this._referenceDataEndpoint = referenceDataEndpoint;
    } else {
      this._hmrcReferenceDataProvider =
        hmrcReferenceDataProviderOrFactory as IHmrcReferenceDataProvider;
    }
  }

  /**
   * Gets a payrun processor for specified pay date and pay period.
   * @param payDate Applicable pay date for the required payrun processor.
   * @param payPeriod Applicable pay period for required payrun processor.
   * @returns An implementation of {@link IPayRunProcessor} for the specified pay date and pay period.
   */
  getProcessor(payDate: PayDate, payPeriod: DateRange): IPayRunProcessor {
    const factories = PayRunProcessorFactory.getFactories(
      this._hmrcReferenceDataProvider ??
        (() => {
          throw new Error(
            "A valid HMRC reference data provider must be provided",
          );
        })(),
    );

    const calculator = new PayRunEntryProcessor(
      factories.taxCalculatorFactory,
      factories.niCalculatorFactory,
      factories.pensionContributionCalculatorFactory,
      factories.studentLoanCalculatorFactory,
      factories.attachmentOfEarningsCalculatorFactory,
      payDate,
      payPeriod,
    );

    return new PayRunProcessor(calculator);
  }

  /**
   * Gets a payrun processor for specified pay run details.
   * @param payRunDetails Pay run details that provide applicable pay date and pay period for the required payrun processor.
   * @returns An implementation of {@link IPayRunProcessor} for the specified pay date and pay period.
   */
  getProcessorForPayRun(payRunDetails: IPayRunDetails): IPayRunProcessor {
    return this.getProcessor(payRunDetails.payDate, payRunDetails.payPeriod);
  }

  // Implementation note: Currently no effort is made to cache any of the factory types or the reference data
  // provider, on the basis that payruns are not created frequently.  However, in a large scale SaaS implementation,
  // we probably need to do something more sophisticated.  One advantage of the current approach is that reference
  // data is refreshed every time a payrun calculator is created; a mechanism to declare the data stale and
  // refresh it is probably needed in the long run.
  private static getFactories(
    referenceDataProvider: IHmrcReferenceDataProvider,
  ): FactorySet {
    return new FactorySet(
      referenceDataProvider,
      new TaxCalculatorFactory(referenceDataProvider),
      new NiCalculatorFactory(referenceDataProvider),
      new StudentLoanCalculatorFactory(referenceDataProvider),
      new PensionContributionCalculatorFactory(referenceDataProvider),
      new AttachmentOfEarningsCalculatorFactory(),
    );
  }
}

class FactorySet {
  hmrcReferenceDataProvider: IHmrcReferenceDataProvider;
  taxCalculatorFactory: ITaxCalculatorFactory;
  niCalculatorFactory: INiCalculatorFactory;
  studentLoanCalculatorFactory: IStudentLoanCalculatorFactory;
  pensionContributionCalculatorFactory: IPensionContributionCalculatorFactory;
  attachmentOfEarningsCalculatorFactory: IAttachmentOfEarningsCalculatorFactory;

  constructor(
    hmrcReferenceDataProvider: IHmrcReferenceDataProvider,
    taxCalculatorFactory: ITaxCalculatorFactory,
    niCalculatorFactory: INiCalculatorFactory,
    studentLoanCalculatorFactory: IStudentLoanCalculatorFactory,
    pensionContributionCalculatorFactory: IPensionContributionCalculatorFactory,
    attachmentOfEarningsCalculatorFactory: IAttachmentOfEarningsCalculatorFactory,
  ) {
    this.hmrcReferenceDataProvider = hmrcReferenceDataProvider;
    this.taxCalculatorFactory = taxCalculatorFactory;
    this.niCalculatorFactory = niCalculatorFactory;
    this.studentLoanCalculatorFactory = studentLoanCalculatorFactory;
    this.pensionContributionCalculatorFactory =
      pensionContributionCalculatorFactory;
    this.attachmentOfEarningsCalculatorFactory =
      attachmentOfEarningsCalculatorFactory;
  }
}
