// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { assert, describe, it, expect, beforeEach, vi } from "vitest";
import { DateRange } from "~/Payetools.Common/Model/DateRange";
import { NiCategory } from "~/Payetools.Common/Model/NiCategory";
import { PayDate } from "~/Payetools.Common/Model/PayDate";
import { NiEarningsBreakdown } from "~/Payetools.NationalInsurance/Model/NiEarningsBreakdown";
import { NiThresholdType } from "~/Payetools.NationalInsurance/Model/NiThresholdType";
import { INiCategoryRatesEntry } from "~/Payetools.NationalInsurance/ReferenceData/INiCategoryRatesEntry";
import { INiThresholdEntry } from "~/Payetools.NationalInsurance/ReferenceData/INiThresholdEntry";
import { INiThresholdSet } from "~/Payetools.NationalInsurance/ReferenceData/INiThresholdSet";
import { Employer } from "~/Payetools.Payroll/Model/Employer";
import { IEmployeePayrollHistoryYtd } from "~/Payetools.Payroll/Model/IEmployeePayrollHistoryYtd";
import { IPayrolledBenefitForPeriod } from "~/Payetools.Payroll/Model/IPayrolledBenefitForPeriod";
import { IPayRunProcessor } from "~/Payetools.Payroll/PayRuns/IPayRunProcessor";
import { EndToEndTestDataSource } from "../Payetools.Testing.Data/EndToEnd/EndToEndTestDataSource";
import { IDeductionsTestDataEntry } from "../Payetools.Testing.Data/EndToEnd/IDeductionsTestDataEntry";
import { IEarningsTestDataEntry } from "../Payetools.Testing.Data/EndToEnd/IEarningsTestDataEntry";
import { INiYtdHistoryTestDataEntry } from "../Payetools.Testing.Data/EndToEnd/INiYtdHistoryTestDataEntry";
import { IPensionSchemesTestDataEntry } from "../Payetools.Testing.Data/EndToEnd/IPensionSchemesTestDataEntry";
import { IPeriodInputTestDataEntry } from "../Payetools.Testing.Data/EndToEnd/IPeriodInputTestDataEntry";
import { IStaticInputTestDataEntry } from "../Payetools.Testing.Data/EndToEnd/IStaticInputTestDataEntry";
import { PayFrequency } from "~/Payetools.Common/Model/PayFrequency";
import { IPreviousYtdTestDataEntry } from "../Payetools.Testing.Data/EndToEnd/IPreviousYtdTestDataEntry";
import { NiCalculationResult } from "~/Payetools.NationalInsurance/Model/NiCalculationResult";
import { EarningsEntry } from "~/Payetools.Payroll/Model/EarningsEntry";
import { DeductionEntry } from "~/Payetools.Payroll/Model/DeductionEntry";
import { IEmployeePayRunResult } from "~/Payetools.Payroll/Model/IEmployeePayRunResult";
import { IExpectedOutputTestDataEntry } from "../Payetools.Testing.Data/EndToEnd/IExpectedOutputTestDataEntry";
import { Money } from "@dintero/money";
import { EmployeePayRunInputEntry } from "~/Payetools.Payroll/Model/EmployeePayRunInputEntry";
import { GenericEarnings } from "./GenericEarnings";
import { GenericDeduction } from "./GenericDeduction";
import { EmployeeNiHistoryEntry } from "~/Payetools.NationalInsurance/Model/EmployeeNiHistoryEntry";
import { NiYtdHistory } from "~/Payetools.NationalInsurance/Model/NiYtdHistory";
import { EmployeePayrollHistoryYtd } from "~/Payetools.Payroll/Model/EmployeePayrollHistoryYtd";
import { gbp, gbpMaybe } from "~/CurrencyHelpers";
import { Employment } from "~/Payetools.Payroll/Model/Employment";
import Big from "big.js";
import { PensionContributionLevels } from "~/Payetools.Payroll/Model/PensionContributionLevels";
import { PayrollProcessorFactoryFixture } from "./PayrollProcessorFactoryFixture";
import { ArgumentException } from "~/Payetools.Common/Diagnostics/ArgumentException";

describe("InitialPayRunForTaxYearTests", () => {
  const payrollProcessorFactoryFixture = new PayrollProcessorFactoryFixture();
  const payDate = new PayDate(2022, 5, 5, PayFrequency.Monthly);

  it("Test1Async", async () => {
    const testData = EndToEndTestDataSource.getAllData();

    console.log(
      `Fetched test data; ${testData.staticInputs.length} static input items returned`,
    );

    const employeePayrollHistory = makeEmployeePayrollHistory(
      testData.previousYtdInputs.filter(
        (pyi) => pyi.testReference === "Pay1",
      )[0],
      testData.niYtdHistory.filter((nyh) => nyh.testReference === "Pay1"),
    );

    if (!employeePayrollHistory) {
      throw new Error("History can't be null");
    }

    console.log("Employee payroll history created okay");

    const staticInput = testData.staticInputs.filter(
      (si) => si.testReference === "Pay1",
    )[0];

    console.log("Static inputs retrieved okay");

    const employer = new Employer("Test Employer Ltd", "Test Employer");

    console.log("Making payroll line items...");

    const [earnings, deductions, payrolledBenefits] = makePayrollLineItems(
      testData.periodInputs.filter((pi) => pi.testReference === "Pay1"),
      testData.earningsDefinitions,
      testData.deductionDefinitions,
    );

    console.log("Making payrun input...");

    const payrunEntry = makeEmployeePayRunInput(
      staticInput,
      testData.pensionSchemes.find(
        (ps) => ps.schemeName === staticInput.pensionScheme,
      ) ?? null,
      employeePayrollHistory,
      earnings,
      deductions,
      payrolledBenefits,
    );

    const employment = payrunEntry.employment;

    const payRunInfo = testData.payRunInfo.filter(
      (pi) => pi.testReference === "Pay1",
    )[0];

    const processor = await getProcessorAsync(
      new PayDate(payRunInfo.payDay, payRunInfo.payFrequency),
      new DateRange(payRunInfo.payPeriodStart, payRunInfo.payPeriodEnd),
    );

    const entries = [payrunEntry];

    const result = processor.process(employer, entries);

    employment.updatePayrollHistory(
      payrunEntry,
      result.employeePayRunResults[0],
    );

    // IEmployeePayrollHistoryYtd historyYtd = employeePayrollHistory.add(payrunEntry, result.employeePayRunResults[0]);

    for (const employeeResult of result.employeePayRunResults) {
      checkResult(
        "Pay1",
        employeeResult,
        testData.expectedOutputs.filter((eo) => eo.testReference === "Pay1")[0],
      );
    }

    console.log(result.employeePayRunResults[0].niCalculationResult.toString());
    console.log();

    console.log();
  });

  function checkResult(
    testReference: string,
    result: IEmployeePayRunResult,
    expected: IExpectedOutputTestDataEntry,
  ): void {
    const because = `TestReference = '${testReference}'`;

    expect(result.totalGrossPay.toNumber(), because).toBe(
      expected.grossPay.toNumber(),
    );
    expect(result.taxablePay.toNumber(), because).toBe(
      expected.taxablePay.toNumber(),
    );
    expect(result.nicablePay.toNumber(), because).toBe(
      expected.nicablePay.toNumber(),
    );
    expect(result.taxCalculationResult.finalTaxDue.toNumber(), because).toBe(
      expected.taxPaid.toNumber(),
    );
    expect(
      result.niCalculationResult.employeeContribution.toNumber(),
      because,
    ).toBe(expected.employeeNiContribution.toNumber());
    expect(
      result.niCalculationResult.employerContribution.toNumber(),
      because,
    ).toBe(expected.employerNiContribution.toNumber());
    expect(result.studentLoanCalculationResult, because).not.toBeUndefined();
    expect(
      result.studentLoanCalculationResult?.studentLoanDeduction.toNumber(),
      because,
    ).toBe(expected.studentLoanRepayments.toNumber());
    expect(
      result.studentLoanCalculationResult?.postgraduateLoanDeduction.toNumber(),
      because,
    ).toBe(expected.graduateLoanRepayments.toNumber());
    expect(
      result.pensionContributionCalculationResult,
      because,
    ).not.toBeUndefined();
    expect(
      result.pensionContributionCalculationResult?.calculatedEmployeeContributionAmount.toNumber(),
      because,
    ).toBe(expected.employeePensionContribution.toNumber());
    expect(
      result.pensionContributionCalculationResult?.calculatedEmployerContributionAmount.toNumber(),
      because,
    ).toBe(expected.employerPensionContribution.toNumber());
  }

  function makeEmployeePayrollHistory(
    previousYtd: IPreviousYtdTestDataEntry,
    niYtdHistory: INiYtdHistoryTestDataEntry[],
  ): IEmployeePayrollHistoryYtd {
    const niHistoryEntries = niYtdHistory.map((nih) => {
      return EmployeeNiHistoryEntry.fromNiCalculationResult(
        new NiCalculationResult(
          nih.niCategoryPertaining,
          nih.grossNicableEarnings,
          new TestNiCategoryRatesEntry(),
          new TestNiThresholdSet(),
          new NiEarningsBreakdown(
            nih.earningsUpToAndIncludingLEL,
            nih.earningsAboveLELUpToAndIncludingST,
            nih.earningsAboveSTUpToAndIncludingPT,
            nih.earningsAbovePTUpToAndIncludingFUST,
            nih.earningsAboveFUSTUpToAndIncludingUEL,
            nih.earningsAboveSTUpToAndIncludingUEL,
            nih.earningsAboveUEL,
          ),
          nih.employeeContribution,
          nih.employerContribution,
          nih.totalContribution,
        ),
      );
    });

    const result = new EmployeePayrollHistoryYtd();

    result.employeeNiHistoryEntries = new NiYtdHistory(niHistoryEntries);
    result.grossPayYtd = previousYtd.grossPayYtd;
    result.nicablePayYtd = previousYtd.nicablePayYtd;
    result.taxablePayYtd = previousYtd.taxablePayYtd;
    result.taxPaidYtd = previousYtd.taxPaidYtd;
    result.taxUnpaidDueToRegulatoryLimit =
      previousYtd.taxUnpaidDueToRegulatoryLimit;
    result.payrolledBenefitsYtd = previousYtd.payrolledBenefitsYtd;
    result.studentLoanRepaymentsYtd = previousYtd.studentLoanRepaymentsYtd;
    result.postgraduateLoanRepaymentsYtd =
      previousYtd.graduateLoanRepaymentsYtd;
    result.statutorySharedParentalPayYtd = previousYtd.sharedParentalPayYtd;
    result.statutoryMaternityPayYtd = previousYtd.statutoryMaternityPayYtd;
    result.statutoryAdoptionPayYtd = previousYtd.statutoryAdoptionPayYtd;
    result.statutoryPaternityPayYtd = previousYtd.statutoryPaternityPayYtd;
    result.statutoryParentalBereavementPayYtd =
      previousYtd.statutoryParentalBereavementPayYtd;
    result.employeePensionContributionsUnderNpaYtd =
      previousYtd.employeePensionContributionsUnderNpaYtd;
    result.employeePensionContributionsUnderRasYtd =
      previousYtd.employeePensionContributionsUnderRasYtd;
    result.employerPensionContributionsYtd =
      previousYtd.employerPensionContributionsYtd;

    return result;
  }

  function makePayrollLineItems(
    periodInputs: IPeriodInputTestDataEntry[],
    earningsDetails: IEarningsTestDataEntry[],
    deductionDetails: IDeductionsTestDataEntry[],
  ): [
    earnings: EarningsEntry[],
    deductions: DeductionEntry[],
    benefits: IPayrolledBenefitForPeriod[],
  ] {
    const earnings: EarningsEntry[] = [];
    const deductions: DeductionEntry[] = [];
    const benefits: IPayrolledBenefitForPeriod[] = [];

    for (const pi of periodInputs) {
      if (!pi.fixedAmount && (!pi.rate || !pi.qty)) {
        throw new Error(
          `Invalid earnings/deduction/benefits entry '${pi.entryType}' with description '${pi.description}'; insufficient data supplied`,
        );
      }

      switch (pi.entryType) {
        case "Earnings":
          const thisEarnings = new EarningsEntry(
            earningsDetails
              .filter((ed) => ed.shortName === pi.shortName)
              .map((ed) => {
                const result = new GenericEarnings();
                result.id = crypto.randomUUID();
                result.shortName = ed.shortName;
                result.isNetToGross = false;
                result.isPensionable = ed.isPensionable;
                result.isSubjectToNi = ed.isSubjectToNi;
                result.isSubjectToTax = ed.isSubjectToTax;
                result.isTreatedAsOvertime = ed.isTreatedAsOvertime;
                return result;
              })[0],
            pi.qty,
            gbpMaybe(pi.rate),
            pi.fixedAmount,
          );

          earnings.push(thisEarnings);
          break;

        case "Deduction":
          const thisDeduction = new DeductionEntry(
            deductionDetails
              .filter((d) => d.shortName === pi.shortName)
              .map((d) => {
                const result = new GenericDeduction();

                result.shortName = d.shortName;
                result.reducesTaxablePay = d.reducesTaxablePay;
                result.reducesNicablePay = d.reducesNicablePay;
                result.reducesPensionablePay = d.reducesPensionablePay;
                result.isUnderSalaryExchangeArrangement =
                  d.isUnderSalaryExchangeArrangement;

                return result;
              })[0],
            pi.qty,
            gbpMaybe(pi.rate),
            pi.fixedAmount,
          );
          deductions.push(thisDeduction);
          break;

        case "PayrolledBenefit":
          const thisBenefit: IPayrolledBenefitForPeriod = {
            amountForPeriod: pi.fixedAmount ?? gbp(pi.rate!.mul(pi.qty!)),
          };
          benefits.push(thisBenefit);
          break;

        default:
          throw new Error(
            `Unrecognised period input type '${pi.entryType}'; must be one of 'Earnings', 'Deduction' or 'PayrolledBenefit'`,
          );
      }
    }

    return [earnings, deductions, benefits];
  }

  function makeEmployeePayRunInput(
    staticEntry: IStaticInputTestDataEntry,
    pensionScheme: IPensionSchemesTestDataEntry | null,
    history: IEmployeePayrollHistoryYtd,
    earnings: EarningsEntry[],
    deductions: DeductionEntry[],
    benefits: IPayrolledBenefitForPeriod[],
  ): EmployeePayRunInputEntry {
    if (pensionScheme == null)
      throw new ArgumentException(
        "Pension scheme name doesn't match a value pension",
        "pensionScheme",
      );

    const employee = {
      firstName: staticEntry.employeeFirstName,
      lastName: staticEntry.employeeLastName,
    };

    const employment = new Employment();

    employment.taxCode = staticEntry.taxCode;
    employment.niCategory = staticEntry.niCategory;
    (employment.studentLoanInfo =
      staticEntry.studentLoanPlan != null || staticEntry.graduateLoan
        ? {
            studentLoanType: staticEntry.studentLoanPlan,
            hasPostGraduateLoan: staticEntry.graduateLoan,
          }
        : undefined),
      (employment.pensionScheme =
        staticEntry.pensionScheme != null
          ? {
              taxTreatment: pensionScheme.taxTreatment,
              earningsBasis: pensionScheme.earningsBasis,
            }
          : undefined),
      (employment.defaultPensionContributionLevels =
        new PensionContributionLevels(Big(0), false, Big(0), false));

    const pensionContributionLevels =
      staticEntry.pensionScheme != null
        ? new PensionContributionLevels(
            staticEntry.employerPercentage ?? Big(0),
            false,
            staticEntry.employeeFixedAmount?.amount() ??
              staticEntry.employeePercentage ??
              Big(0),
            staticEntry.employeeFixedAmount != null,
          )
        : new PensionContributionLevels(Big(0), false, Big(0), false);

    return new EmployeePayRunInputEntry(
      employment,
      earnings,
      deductions,
      benefits,
      pensionContributionLevels,
    );
  }

  async function getProcessorAsync(
    payDate: PayDate,
    payPeriod: DateRange,
  ): Promise<IPayRunProcessor> {
    const factory = await payrollProcessorFactoryFixture.getFactory();

    return factory.getProcessor(payDate, payPeriod);
  }

  class TestNiCategoryRatesEntry implements INiCategoryRatesEntry {
    public category: NiCategory = NiCategory.Unspecified;
    public employeeRateToPT: Big = Big(0);
    public employeeRatePTToUEL: Big = Big(0);
    public employeeRateAboveUEL: Big = Big(0);
    public employerRateLELToST: Big = Big(0);
    public employerRateSTToFUST: Big = Big(0);
    public employerRateFUSTToUEL: Big = Big(0);
    public employerRateAboveUEL: Big = Big(0);
  }

  class TestNiThresholdSet
    extends Array<INiThresholdEntry>
    implements INiThresholdSet
  {
    public count: number = 0;

    public getEnumerator(): Iterator<INiThresholdEntry> {
      throw new Error("Method not implemented.");
    }

    public getThreshold(thresholdType: NiThresholdType): Money {
      throw new Error("Method not implemented.");
    }
  }
});
