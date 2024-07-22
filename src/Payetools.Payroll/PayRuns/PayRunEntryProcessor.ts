// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { CountriesForTaxPurposes } from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { PensionTaxTreatment } from "~/Payetools.Common/Model/PensionTaxTreatment";
import { PensionsEarningsBasis } from "~/Payetools.Common/Model/PensionsEarningsBasis";
import { ITaxCalculator } from "~/Payetools.IncomeTax/ITaxCalculator";
import { ITaxCalculatorFactory } from "~/Payetools.IncomeTax/ITaxCalculatorFactory";
import { ITaxCalculationResult } from "~/Payetools.IncomeTax/Model/ITaxCalculationResult";
import { INiCalculator } from "~/Payetools.NationalInsurance/INiCalculator";
import { INiCalculatorFactory } from "~/Payetools.NationalInsurance/INiCalculatorFactory";
import { DirectorsNiCalculationMethod } from "~/Payetools.NationalInsurance/Model/DirectorsNiCalculationMethod";
import { INiCalculationResult } from "~/Payetools.NationalInsurance/Model/INiCalculationResult";
import { AttachmentOfEarningsType } from "~/Payetools.Statutory/AttachmentOfEarnings/AttachmentOfEarningsType";
import { IAttachmentOfEarningsCalculationResult } from "~/Payetools.Statutory/AttachmentOfEarnings/IAttachmentOfEarningsCalculationResult";
import { IAttachmentOfEarningsCalculator } from "~/Payetools.Statutory/AttachmentOfEarnings/IAttachmentOfEarningsCalculator";
import { IAttachmentOfEarningsCalculatorFactory } from "~/Payetools.Statutory/AttachmentOfEarnings/IAttachmentOfEarningsCalculatorFactory";
import { IStudentLoanCalculator } from "~/Payetools.StudentLoans/IStudentLoanCalculator";
import { IStudentLoanCalculatorFactory } from "~/Payetools.StudentLoans/IStudentLoanCalculatorFactory";
import { IStudentLoanCalculationResult } from "~/Payetools.StudentLoans/Model/IStudentLoanCalculationResult";
import { EmployeePayRunResult } from "~/Payetools.Payroll/Model/EmployeePayRunResult";
import { IEmployeePayRunInputEntry } from "~/Payetools.Payroll/Model/IEmployeePayRunInputEntry";
import { IEmployeePayRunResult } from "~/Payetools.Payroll/Model/IEmployeePayRunResult";
import { IPensionContributionCalculator } from "~/Payetools.Pensions/IPensionContributionCalculator";
import { IPensionContributionCalculatorFactory } from "~/Payetools.Pensions/IPensionContributionCalculatorFactory";
import { IPensionContributionCalculationResult } from "~/Payetools.Pensions/Model/IPensionContributionCalculationResult";
import { PensionContributionCalculationResult } from "~/Payetools.Pensions/Model/PensionContributionCalculationResult";
import { Money } from "@dintero/money";
import { zeroGbp } from "~/CurrencyHelpers";
import Big from "big.js";
import { IPayRunEntryProcessor } from "./IPayRunEntryProcessor";

export interface IEarningsTotals {
  grossPay: Money;
  workingGrossPay: Money;
  taxablePay: Money;
  nicablePay: Money;
  pensionablePay: Money;
  benefitsInKind?: Money;
}

export class PayRunEntryProcessor implements IPayRunEntryProcessor {
  private readonly _incomeTaxCalculators: Map<
    CountriesForTaxPurposes,
    ITaxCalculator
  >;
  private readonly _niCalculator: INiCalculator;
  private readonly _pensionCalculatorFactory: IPensionContributionCalculatorFactory;
  private readonly _studentLoanCalculator: IStudentLoanCalculator;
  private readonly _attachmentOfEarningsCalculatorFactory: IAttachmentOfEarningsCalculatorFactory;
  private readonly _pensionCalculators: Map<
    [PensionsEarningsBasis, PensionTaxTreatment],
    IPensionContributionCalculator
  >;
  private readonly _attachmentOfEarningsCalculators: Map<
    AttachmentOfEarningsType,
    IAttachmentOfEarningsCalculator
  >;

  public payDate: PayDate;
  public payPeriod: DateRange;

  constructor(
    incomeTaxCalcFactory: ITaxCalculatorFactory,
    niCalcFactory: INiCalculatorFactory,
    pensionCalcFactory: IPensionContributionCalculatorFactory,
    studentLoanCalcFactory: IStudentLoanCalculatorFactory,
    attachmentOfEarningsCalculatorFactory: IAttachmentOfEarningsCalculatorFactory,
    payDate: PayDate,
    payPeriod: DateRange,
  ) {
    this._incomeTaxCalculators = new Map(
      payDate.taxYear
        .getCountriesForYear()
        .map((regime) => [
          regime,
          incomeTaxCalcFactory.getCalculator(regime, payDate),
        ]),
    );
    this._niCalculator = niCalcFactory.getCalculator(payDate);
    this._pensionCalculatorFactory = pensionCalcFactory;
    this._studentLoanCalculator = studentLoanCalcFactory.getCalculator(payDate);
    this._attachmentOfEarningsCalculatorFactory =
      attachmentOfEarningsCalculatorFactory;
    this.payDate = payDate;
    this.payPeriod = payPeriod;
    this._pensionCalculators = new Map<
      [PensionsEarningsBasis, PensionTaxTreatment],
      IPensionContributionCalculator
    >();
    this._attachmentOfEarningsCalculators = new Map<
      AttachmentOfEarningsType,
      IAttachmentOfEarningsCalculator
    >();
  }

  public process(entry: IEmployeePayRunInputEntry): IEmployeePayRunResult {
    const earningsTotals = this.getAllEarningsTypes(entry);

    let employersNiSavings = zeroGbp;
    let workingGrossPay = earningsTotals.workingGrossPay;
    let taxablePay = earningsTotals.taxablePay;
    let nicablePay = earningsTotals.nicablePay;
    let pensionablePay = earningsTotals.pensionablePay;
    let pensionContributions: IPensionContributionCalculationResult | null =
      null;

    let niCalculationResult = this.calculateNiContributions(entry, nicablePay);

    if (
      entry.employment.pensionScheme != null &&
      entry.pensionContributionLevels != undefined
    ) {
      const key: [PensionsEarningsBasis, PensionTaxTreatment] = [
        entry.employment.pensionScheme.earningsBasis,
        entry.employment.pensionScheme.taxTreatment,
      ];

      const calculator = this.getCalculator(this._pensionCalculators, key, () =>
        this._pensionCalculatorFactory.getCalculator(
          key[0],
          key[1],
          this.payDate,
        ),
      );

      if (entry.pensionContributionLevels.salaryExchangeApplied) {
        const salaryExchangedAmount = calculator.getSalaryExchangedAmount(
          earningsTotals.pensionablePay,
          entry.pensionContributionLevels.employeeContribution,
          entry.pensionContributionLevels.employeeContributionIsFixedAmount,
        );

        const originalEmployersNi = niCalculationResult.employerContribution;

        nicablePay = nicablePay.subtract(salaryExchangedAmount);
        workingGrossPay = workingGrossPay.subtract(salaryExchangedAmount);
        taxablePay = taxablePay.subtract(salaryExchangedAmount);

        niCalculationResult = this.calculateNiContributions(entry, nicablePay);

        employersNiSavings = originalEmployersNi.subtract(
          niCalculationResult.employerContribution,
        );
      }

      const pensionContributionsResult = this.calculatePensionContributions(
        entry,
        earningsTotals.pensionablePay,
        employersNiSavings,
      );

      pensionContributions = pensionContributionsResult;

      if (
        entry.pensionContributionLevels?.salaryExchangeApplied === false &&
        entry.employment.pensionScheme?.taxTreatment ===
          PensionTaxTreatment.NetPayArrangement
      ) {
        workingGrossPay = workingGrossPay.subtract(
          pensionContributions.calculatedEmployeeContributionAmount,
        );
        taxablePay = taxablePay.subtract(
          pensionContributions.calculatedEmployeeContributionAmount,
        );
      }
    }

    const taxCalculator = this._incomeTaxCalculators.get(
      entry.employment.taxCode.applicableCountries,
    );

    if (!taxCalculator) {
      throw new Error(
        `Unable to perform tax calculation as calculator for tax regime '${entry.employment.taxCode.taxRegimeLetter}' is not available`,
      );
    }

    const taxCalculationResult = taxCalculator.calculate(
      taxablePay,
      earningsTotals.benefitsInKind ?? zeroGbp,
      entry.employment.taxCode,
      entry.employment.payrollHistoryYtd.taxablePayYtd,
      entry.employment.payrollHistoryYtd.taxPaidYtd,
      entry.employment.payrollHistoryYtd.taxUnpaidDueToRegulatoryLimit,
    );

    let studentLoanCalculationResult: IStudentLoanCalculationResult | null =
      null;

    if (entry.employment.studentLoanInfo != null) {
      studentLoanCalculationResult = this._studentLoanCalculator.calculate(
        earningsTotals.grossPay,
        entry.employment.studentLoanInfo?.studentLoanType ?? null,
        entry.employment.studentLoanInfo?.hasPostGraduateLoan === true,
      );
    }

    let attachmentOfEarningsCalculationResult: IAttachmentOfEarningsCalculationResult | null =
      null;

    return new EmployeePayRunResult(
      entry.employment,
      taxCalculationResult,
      niCalculationResult,
      studentLoanCalculationResult,
      pensionContributions,
      attachmentOfEarningsCalculationResult,
      earningsTotals.grossPay,
      workingGrossPay,
      taxablePay,
      nicablePay,
      earningsTotals.benefitsInKind ?? null,
      zeroGbp, // otherDeductions,
      entry.employment.payrollHistoryYtd,
      entry.isLeaverInThisPayRun,
      entry.isPaymentAfterLeaving,
    );
  }

  private getAllEarningsTypes(
    entry: IEmployeePayRunInputEntry,
  ): IEarningsTotals {
    let grossPay = zeroGbp;
    let taxablePay = zeroGbp;
    let nicablePay = zeroGbp;
    let pensionablePay = zeroGbp;
    let benefitsInKind = zeroGbp;

    entry.earnings.forEach((e) => {
      grossPay = grossPay.add(e.totalEarnings);
      taxablePay = taxablePay.add(
        e.earningsDetails.isSubjectToTax ? e.totalEarnings : zeroGbp,
      );
      nicablePay = nicablePay.add(
        e.earningsDetails.isSubjectToNi ? e.totalEarnings : zeroGbp,
      );
      pensionablePay = pensionablePay.add(
        e.earningsDetails.isPensionable ? e.totalEarnings : zeroGbp,
      );
    });

    let workingGrossPay = grossPay;

    entry.deductions.forEach((d) => {
      taxablePay = taxablePay.subtract(
        d.deductionClassification.reducesTaxablePay
          ? d.totalDeduction
          : zeroGbp,
      );
      nicablePay = nicablePay.subtract(
        d.deductionClassification.reducesNicablePay
          ? d.totalDeduction
          : zeroGbp,
      );
      pensionablePay = pensionablePay.subtract(
        d.deductionClassification.reducesPensionablePay
          ? d.totalDeduction
          : zeroGbp,
      );
      workingGrossPay = workingGrossPay.subtract(
        d.deductionClassification.reducesGrossPay ? d.totalDeduction : zeroGbp,
      );
    });

    entry.payrolledBenefits.forEach((b) => {
      taxablePay = taxablePay.add(b.amountForPeriod);
      benefitsInKind = benefitsInKind.add(b.amountForPeriod);
    });

    const earningsTotals: IEarningsTotals = {
      grossPay, //: Math.round(grossPay * 100) / 100,
      workingGrossPay, //: Math.round(workingGrossPay * 100) / 100,
      taxablePay, //: Math.round(taxablePay * 100) / 100,
      nicablePay, //: Math.round(nicablePay * 100) / 100,
      pensionablePay, //: Math.round(pensionablePay * 100) / 100,
      benefitsInKind: benefitsInKind !== zeroGbp ? benefitsInKind : undefined,
    };

    return earningsTotals;
  }

  private calculateNiContributions(
    entry: IEmployeePayRunInputEntry,
    nicablePay: Money,
  ): INiCalculationResult {
    if (entry.employment.isDirector) {
      const histories =
        entry.employment.payrollHistoryYtd.employeeNiHistoryEntries;

      const { employeeTotal, employerTotal } =
        entry.employment.payrollHistoryYtd.employeeNiHistoryEntries.getNiYtdTotals();

      return this._niCalculator.calculateDirectors(
        entry.employment.directorsNiCalculationMethod ??
          DirectorsNiCalculationMethod.StandardAnnualisedEarningsMethod,
        entry.employment.niCategory,
        nicablePay,
        nicablePay.add(entry.employment.payrollHistoryYtd.nicablePayYtd),
        employeeTotal,
        employerTotal,
        undefined,
      );
    } else {
      return this._niCalculator.calculate(
        entry.employment.niCategory,
        nicablePay,
      );
    }
  }

  private calculatePensionContributions(
    entry: IEmployeePayRunInputEntry,
    pensionablePay: Money,
    employersNiSavings: Money,
  ): IPensionContributionCalculationResult {
    if (!entry.employment.pensionScheme || !entry.pensionContributionLevels) {
      return PensionContributionCalculationResult.noPensionApplicable;
    } else {
      const key: [PensionsEarningsBasis, PensionTaxTreatment] = [
        entry.employment.pensionScheme.earningsBasis,
        entry.employment.pensionScheme.taxTreatment,
      ];

      const calculator = this.getCalculator(this._pensionCalculators, key, () =>
        this._pensionCalculatorFactory.getCalculator(
          key[0],
          key[1],
          this.payDate,
        ),
      );

      if (entry.pensionContributionLevels.salaryExchangeApplied) {
        return calculator.calculateUnderSalaryExchange(
          pensionablePay,
          entry.pensionContributionLevels.employerContribution,
          entry.pensionContributionLevels.employerContributionIsFixedAmount,
          employersNiSavings,
          entry.pensionContributionLevels.employersNiReinvestmentPercentage ??
            Big(0.0),
          entry.pensionContributionLevels.employeeContribution,
          entry.pensionContributionLevels.employeeContributionIsFixedAmount,
          entry.pensionContributionLevels.avcForPeriod ?? zeroGbp,
          entry.pensionContributionLevels.salaryForMaternityPurposes,
        );
      } else {
        return calculator.calculate(
          pensionablePay,
          entry.pensionContributionLevels.employerContribution,
          entry.pensionContributionLevels.employerContributionIsFixedAmount,
          entry.pensionContributionLevels.employeeContribution,
          entry.pensionContributionLevels.employeeContributionIsFixedAmount,
          entry.pensionContributionLevels.avcForPeriod ?? zeroGbp,
          entry.pensionContributionLevels.salaryForMaternityPurposes ?? null,
        );
      }
    }
  }

  private getCalculator<TKey, TCalculator>(
    dictionary: Map<TKey, TCalculator>,
    key: TKey,
    calculatorFactoryFunction: () => TCalculator,
  ): TCalculator {
    let calculator = dictionary.get(key);

    if (!calculator) {
      calculator = calculatorFactoryFunction();
      dictionary.set(key, calculator);
    }

    return calculator;
  }
}
