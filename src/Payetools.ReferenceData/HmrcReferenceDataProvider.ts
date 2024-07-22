// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CountriesForTaxPurposes } from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import { IApplicableFromTill } from "~/Payetools.Common/Model/IApplicableFromTill";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { TaxYearEnding } from "~/Payetools.Common/Model/TaxYearEnding";
import { INmwLevelSet } from "~/Payetools.NationalMinimumWage/ReferenceData/INmwLevelSet";
import { ApprenticeLevyInfo } from "./Employer/ApprenticeLevyInfo";
import { EmploymentAllowanceInfo } from "./Employer/EmploymentAllowanceInfo";
import { StatutoryPaymentReclaimInfo } from "./Employer/StatutoryPaymentReclaimInfo";
import { HmrcTaxYearReferenceDataSet } from "./HmrcTaxYearReferenceDataSet";
import { IHmrcReferenceDataProvider } from "./IHmrcReferenceDataProvider";
import { IncomeTaxReferenceDataEntry } from "./IncomeTax/IncomeTaxReferenceDataEntry";
import { NiCategoryRatesEntry } from "./NationalInsurance/NiCategoryRatesEntry";
import { NiEmployeeRatesEntry } from "./NationalInsurance/NiEmployeeRatesEntry";
import { NiEmployerRatesEntry } from "./NationalInsurance/NiEmployerRatesEntry";
import { NmwReferenceDataEntry } from "./NationalMinimumWage/NmwReferenceDataEntry";
import { PensionsReferenceDataSet } from "./Pensions/PensionsReferenceDataSet";
import { CalendarDate } from "calendar-date";
import { IStudentLoanRateSet } from "~/Payetools.StudentLoans/ReferenceData/IStudentLoanRateSet";
import { IStudentLoanThresholdSet } from "~/Payetools.StudentLoans/ReferenceData/IStudentLoanThresholdSet";
import { StudentLoanThresholdSet } from "~/Payetools.StudentLoans/ReferenceData/StudentLoanThresholdSet";
import { StudentLoanReferenceDataEntry } from "./StudentLoans/StudentLoanReferenceDataEntry";
import { gbp } from "~/CurrencyHelpers";
import { NiReferenceDataEntry } from "./NationalInsurance/NiReferenceDataEntry";
import { INiCategoryRatesEntry } from "~/Payetools.NationalInsurance/ReferenceData/INiCategoryRatesEntry";
import { TaxBandwidthSet } from "~/Payetools.IncomeTax/ReferenceData/TaxBandwidthSet";
import { INiThresholdSet } from "~/Payetools.NationalInsurance/ReferenceData/INiThresholdSet";
import { NiThresholdSet } from "~/Payetools.NationalInsurance/ReferenceData/NiThresholdSet";
import { Money } from "@dintero/money";

export class HmrcReferenceDataProvider implements IHmrcReferenceDataProvider {
  private readonly _referenceDataSets: Map<
    TaxYearEnding,
    HmrcTaxYearReferenceDataSet
  >;

  public health: string;

  public constructor(dataSets?: HmrcTaxYearReferenceDataSet[]) {
    if (dataSets == null) {
      this._referenceDataSets = new Map<
        TaxYearEnding,
        HmrcTaxYearReferenceDataSet
      >();
      this.health = "No tax years added";
      return;
    }

    this._referenceDataSets = new Map<
      TaxYearEnding,
      HmrcTaxYearReferenceDataSet
    >();

    const health: string[] = [];

    for (const dataSet of dataSets) {
      const result = this.TryAdd(dataSet);
      if (result.isValid) {
        health.push(`${dataSet.applicableTaxYearEnding}:OK`);
      } else {
        health.push(
          `${dataSet.applicableTaxYearEnding}:Data set failed validation; ${result.errorMessage}`,
        );
      }
    }

    this.health = health.join("|");
  }

  public getTaxBandsForTaxYearAndPeriod(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): Map<CountriesForTaxPurposes, TaxBandwidthSet> {
    const referenceDataSet = this.getReferenceDataSetForTaxYear(taxYear);

    const taxBands =
      this.findApplicableEntryForTaxPeriod<IncomeTaxReferenceDataEntry>(
        referenceDataSet.incomeTax,
        taxYear,
        payFrequency,
        taxPeriod,
      );

    return new Map(
      taxBands.taxEntries.map((entry) => {
        return [
          entry.applicableCountries,
          new TaxBandwidthSet(entry.getTaxBandwidthEntries()),
        ];
      }),
    );
  }

  public getNiRatesForPayDate(
    payDate: PayDate,
  ): Map<NiCategory, INiCategoryRatesEntry> {
    const referenceDataSet = this.getReferenceDataSetForTaxYear(
      payDate.taxYear,
    );

    const niReferenceDataEntry =
      this.findApplicableEntryForPayDate<NiReferenceDataEntry>(
        referenceDataSet.nationalInsurance,
        payDate,
      );

    const rates = this.makeNiCategoryRatesEntries(
      niReferenceDataEntry.employerRates,
      niReferenceDataEntry.employeeRates,
    );

    return new Map<NiCategory, INiCategoryRatesEntry>(rates);
  }

  public getDirectorsNiRatesForPayDate(
    payDate: PayDate,
  ): Map<NiCategory, INiCategoryRatesEntry> {
    const referenceDataSet = this.getReferenceDataSetForTaxYear(
      payDate.taxYear,
    );

    const niReferenceDataEntry =
      this.findApplicableEntryForPayDate<NiReferenceDataEntry>(
        referenceDataSet.nationalInsurance,
        payDate,
      );

    const employerRates =
      niReferenceDataEntry.directorEmployerRates ??
      niReferenceDataEntry.employerRates;
    const employeeRates =
      niReferenceDataEntry.directorEmployeeRates ??
      niReferenceDataEntry.employeeRates;

    const rates = this.makeNiCategoryRatesEntries(employerRates, employeeRates);

    return new Map<NiCategory, INiCategoryRatesEntry>(rates);
  }

  public getNiThresholdsForPayDate(payDate: PayDate): INiThresholdSet {
    const referenceDataSet = this.getReferenceDataSetForTaxYear(
      payDate.taxYear,
    );

    const niReferenceDataEntry =
      this.findApplicableEntryForPayDate<NiReferenceDataEntry>(
        referenceDataSet.nationalInsurance,
        payDate,
      );

    const thresholds = niReferenceDataEntry.niThresholds
      .sort((a, b) => a.thresholdType - b.thresholdType)
      .map((threshold) => {
        return {
          thresholdType: threshold.thresholdType,
          thresholdValuePerYear: threshold.thresholdValuePerYear,
        };
      });

    return NiThresholdSet.fromThresholds(
      thresholds,
      payDate.taxYear.taxYearEnding,
    );
  }

  public getThresholdsForQualifyingEarnings(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): { lowerLimit: Money; upperLimit: Money } {
    const referenceDataSet = this.getReferenceDataSetForTaxYear(taxYear);

    const pensionsReferenceDataEntry =
      this.findApplicableEntryForTaxPeriod<PensionsReferenceDataSet>(
        referenceDataSet.pensions,
        taxYear,
        payFrequency,
        taxPeriod,
      );

    return {
      lowerLimit:
        pensionsReferenceDataEntry.qualifyingEarningsLowerLevel.getThresholdForPayFrequency(
          payFrequency,
        ),
      upperLimit:
        pensionsReferenceDataEntry.qualifyingEarningsUpperLevel.getThresholdForPayFrequency(
          payFrequency,
        ),
    };
  }

  public getBasicRateOfTaxForTaxRelief(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): Big {
    const referenceDataSet = this.getReferenceDataSetForTaxYear(taxYear);

    const pensionsReferenceDataEntry =
      this.findApplicableEntryForTaxPeriod<PensionsReferenceDataSet>(
        referenceDataSet.pensions,
        taxYear,
        payFrequency,
        taxPeriod,
      );

    return pensionsReferenceDataEntry.basicRateOfTaxForTaxRelief;
  }

  public getNmwLevelsForTaxYearAndPeriod(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): INmwLevelSet {
    const referenceDataSet = this.getReferenceDataSetForTaxYear(taxYear);

    return this.findApplicableEntryForTaxPeriod<NmwReferenceDataEntry>(
      referenceDataSet.nationalMinimumWage,
      taxYear,
      payFrequency,
      taxPeriod,
    );
  }

  public getStudentLoanThresholdsForTaxYearAndPeriod(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): IStudentLoanThresholdSet {
    const referenceDataSet = this.getReferenceDataSetForTaxYear(taxYear);

    const thresholdsSet =
      this.findApplicableEntryForTaxPeriod<StudentLoanReferenceDataEntry>(
        referenceDataSet.studentLoans,
        taxYear,
        payFrequency,
        taxPeriod,
      );

    return new StudentLoanThresholdSet(
      thresholdsSet.plan1Thresholds.thresholdValuePerYear,
      thresholdsSet.plan2Thresholds.thresholdValuePerYear,
      thresholdsSet.plan4Thresholds.thresholdValuePerYear,
      thresholdsSet.postGradThresholds.thresholdValuePerYear,
    );
  }

  public getStudentLoanRatesForTaxYearAndPeriod(
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): IStudentLoanRateSet {
    const referenceDataSet = this.getReferenceDataSetForTaxYear(taxYear);

    return this.findApplicableEntryForTaxPeriod<StudentLoanReferenceDataEntry>(
      referenceDataSet.studentLoans,
      taxYear,
      payFrequency,
      taxPeriod,
    ).deductionRates;
  }

  public getEmploymentAllowanceInfoForDate(
    date: CalendarDate,
  ): EmploymentAllowanceInfo {
    throw new Error("Not implemented");
  }

  public getStatutoryPaymentReclaimInfoForDate(
    date: CalendarDate,
  ): StatutoryPaymentReclaimInfo {
    throw new Error("Not implemented");
  }

  public getApprenticeLevyInfoForDate(date: CalendarDate): ApprenticeLevyInfo {
    throw new Error("Not implemented");
  }

  private TryAdd(referenceDataSet: HmrcTaxYearReferenceDataSet): {
    isValid: boolean;
    errorMessage?: string;
  } {
    const { isValid, errorMessage } =
      this.ValidateReferenceData(referenceDataSet);

    if (!isValid) {
      return { isValid: false, errorMessage };
    }

    this._referenceDataSets.set(
      referenceDataSet.applicableTaxYearEnding,
      referenceDataSet,
    );
    return { isValid: true };
  }

  private getReferenceDataSetForTaxYear(
    taxYear: TaxYear,
  ): HmrcTaxYearReferenceDataSet {
    const referenceDataSet = this._referenceDataSets.get(taxYear.taxYearEnding);

    if (!referenceDataSet) {
      throw new Error(
        `No reference data found for tax year ending ${taxYear.endOfTaxYear}`,
      );
    }

    if (
      !referenceDataSet.incomeTax ||
      !referenceDataSet.nationalInsurance ||
      !referenceDataSet.pensions ||
      !referenceDataSet.nationalMinimumWage ||
      !referenceDataSet.studentLoans
    ) {
      throw new Error(
        `Reference data for tax year ending ${taxYear.endOfTaxYear} is invalid or incomplete`,
      );
    }

    return referenceDataSet;
  }

  private findApplicableEntryForPayDate<T>(
    entries: IApplicableFromTill[],
    payDate: PayDate,
  ): T {
    const entry = entries.find((entry) => {
      return (
        entry.applicableFrom.isBeforeOrEqual(payDate.date) &&
        payDate.date.isBeforeOrEqual(entry.applicableTill)
      );
    });

    if (!entry) {
      //      throw new Error(`Unable to find reference data entry for specified pay date ${payDate} (Type: '${typeof T}')`);
      throw new Error(
        `Unable to find reference data entry for specified pay date ${payDate}`,
      );
    }

    return entry as T;
  }

  private findApplicableEntryForTaxPeriod<T>(
    entries: IApplicableFromTill[],
    taxYear: TaxYear,
    payFrequency: PayFrequency,
    taxPeriod: number,
  ): T {
    const endDateOfPeriod = taxYear.getLastDayOfTaxPeriod(
      payFrequency,
      taxPeriod,
    );

    const entry = entries.find((entry) => {
      return (
        entry.applicableFrom <= endDateOfPeriod &&
        endDateOfPeriod <= entry.applicableTill
      );
    });

    if (!entry) {
      throw new Error(
        //        `Unable to find reference data entry for specified tax year, pay frequency and pay period (Type: '${typeof T}')`
        `Unable to find reference data entry for specified tax year, pay frequency and pay period`,
      );
    }

    return entry as T;
  }

  private makeNiCategoryRatesEntries(
    employerRateEntries: NiEmployerRatesEntry[],
    employeeRateEntries: NiEmployeeRatesEntry[],
  ): Map<NiCategory, INiCategoryRatesEntry> {
    const rateEntries = new Map<NiCategory, NiCategoryRatesEntry>();

    for (const erEntry of employerRateEntries) {
      for (const erCategory of erEntry.niCategories) {
        let rateEntry = rateEntries.get(erCategory);

        if (!rateEntry) {
          rateEntry = new NiCategoryRatesEntry(erCategory);
          rateEntries.set(erCategory, rateEntry);
        }

        rateEntry.employerRateLELToST =
          erEntry.forEarningsAtOrAboveLELUpToAndIncludingST;
        rateEntry.employerRateSTToFUST =
          erEntry.forEarningsAboveSTUpToAndIncludingFUST;
        rateEntry.employerRateFUSTToUEL =
          erEntry.forEarningsAboveFUSTUpToAndIncludingUELOrUST;
        rateEntry.employerRateAboveUEL = erEntry.forEarningsAboveUELOrUST;
      }
    }

    for (const eeEntry of employeeRateEntries) {
      for (const erCategory of eeEntry.niCategories) {
        let rateEntry = rateEntries.get(erCategory);

        if (!rateEntry) {
          rateEntry = new NiCategoryRatesEntry(erCategory);
          rateEntries.set(erCategory, rateEntry);
        }

        rateEntry.employeeRateToPT =
          eeEntry.forEarningsAtOrAboveLELUpTAndIncludingPT;
        rateEntry.employeeRatePTToUEL =
          eeEntry.forEarningsAbovePTUpToAndIncludingUEL;
        rateEntry.employeeRateAboveUEL = eeEntry.forEarningsAboveUEL;
      }
    }

    return rateEntries;
  }

  private ValidateReferenceData(
    referenceDataSet: HmrcTaxYearReferenceDataSet,
  ): { isValid: boolean; errorMessage?: string } {
    const empty = !referenceDataSet;
    const noIncomeTax = !empty && !referenceDataSet.incomeTax;
    const noNi = !empty && !referenceDataSet.nationalInsurance;
    const noPensions = !empty && !referenceDataSet.pensions;
    const noNmw = !empty && !referenceDataSet.nationalMinimumWage;
    const noStudentLoan = !empty && !referenceDataSet.studentLoans;

    const isValid = !(
      empty ||
      noIncomeTax ||
      noNi ||
      noPensions ||
      noNmw ||
      noStudentLoan
    );

    if (isValid) {
      return { isValid: true };
    }

    return { isValid: false, errorMessage: "" };
  }
}
