// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { ArgumentException } from "~/Payetools.Common/Diagnostics/ArgumentException";
import { InconsistentDataException } from "~/Payetools.Common/Diagnostics/InconsistentDataException";
import { InvalidReferenceDataException } from "~/Payetools.Common/Diagnostics/InvalidReferenceDataException";
import { CountriesForTaxPurposes } from "~/Payetools.Common/Model/CountriesForTaxPurposes";
import {
  PayFrequency,
  PayFrequencyExtensions,
} from "~/Payetools.Common/Model/PayFrequency";
import { TaxCode } from "~/Payetools.Common/Model/TaxCode";
import {
  TaxTreatment,
  TaxTreatmentExtensions,
} from "~/Payetools.Common/Model/TaxTreatment";
import { TaxYear } from "~/Payetools.Common/Model/TaxYear";
import { ITaxCalculationResult } from "./Model/ITaxCalculationResult";
import { TaxBandwidthSet } from "./ReferenceData/TaxBandwidthSet";
import { TaxPeriodBandwidthSet } from "./ReferenceData/TaxPeriodBandwidthSet";
import { Money } from "@dintero/money";
import { ITaxCalculator } from "./ITaxCalculator";
import { TaxCalculationResult } from "./Model/TaxCalculationResult";
import { RoundDown, RoundUp, gbp, zeroGbp } from "~/CurrencyHelpers";
import Big from "big.js";

export class TaxCalculator implements ITaxCalculator {
  private readonly _applicableCountries: CountriesForTaxPurposes;
  public taxBandwidths: TaxPeriodBandwidthSet;
  public taxPeriodCount: number;

  constructor(
    public taxYear: TaxYear,
    applicableCountries: CountriesForTaxPurposes,
    annualTaxBandwidths: TaxBandwidthSet,
    public payFrequency: PayFrequency,
    public taxPeriod: number,
  ) {
    this._applicableCountries = applicableCountries;
    this.taxBandwidths = new TaxPeriodBandwidthSet(
      annualTaxBandwidths,
      payFrequency,
      taxPeriod,
    );
    this.taxPeriodCount =
      PayFrequencyExtensions.getStandardTaxPeriodCount(payFrequency);
  }

  calculate(
    totalTaxableSalaryInPeriod: Money,
    benefitsInKind: Money,
    taxCode: TaxCode,
    taxableSalaryYearToDate: Money,
    taxPaidYearToDate: Money,
    taxUnpaidDueToRegulatoryLimit: Money,
  ): ITaxCalculationResult {
    if (
      taxCode.taxTreatment !== TaxTreatment.NT &&
      taxCode.applicableCountries !== this._applicableCountries
    ) {
      throw new ArgumentException(
        `Supplied tax code '${taxCode.toStringWithOptions(true, true)}' does not match tax regime '${this._applicableCountries}' for tax calculator for tax year ${this.taxYear.taxYearEnding}`,
        "taxCode",
      );
    }

    let internalResult: InternalTaxCalculationResult;

    if (taxCode.isFixedCode && taxCode.taxTreatment !== TaxTreatment._0T) {
      internalResult = this.calculateTaxDueOnFixedTaxCode(
        totalTaxableSalaryInPeriod,
        taxCode,
        taxableSalaryYearToDate,
        taxPaidYearToDate,
        benefitsInKind,
        taxUnpaidDueToRegulatoryLimit,
      );
    } else {
      internalResult = this.calculateTaxDueOnNonFixedTaxCode(
        totalTaxableSalaryInPeriod,
        taxCode,
        taxableSalaryYearToDate,
        taxPaidYearToDate,
        benefitsInKind,
        taxUnpaidDueToRegulatoryLimit,
      );
    }

    return new TaxCalculationResult(
      this,
      taxCode,
      internalResult.taxFreePayForPeriod,
      internalResult.taxableSalary,
      taxableSalaryYearToDate,
      taxPaidYearToDate,
      internalResult.highestApplicableTaxBandIndex,
      internalResult.incomeAtHighestApplicableBand,
      internalResult.taxAtHighestApplicableBand,
      internalResult.taxInExcessOfRegulatoryLimit,
      internalResult.taxDueBeforeRegulatoryLimit,
      internalResult.finalTaxDue,
    );
  }

  // NB A fixed code means codes like "BR" and "D0"; a "non-fixed" code here means anything else, e.g., 1257L.
  private calculateTaxDueOnNonFixedTaxCode(
    totalTaxableSalaryInPeriod: Money,
    taxCode: TaxCode,
    taxableSalaryYearToDate: Money,
    taxPaidYearToDate: Money,
    benefitsInKind: Money,
    taxUnpaidDueToRegulatoryLimit: Money,
  ): InternalTaxCalculationResult {
    const taxFreePayToEndOfPeriod = taxCode.getTaxFreePayForPeriod(
      this.taxPeriod,
      this.taxPeriodCount,
    );

    let result: InternalTaxCalculationResult;
    if (taxCode.isNonCumulative) {
      result = this.CalculateTaxDueNonCumulativeNonFixedCode(
        totalTaxableSalaryInPeriod,
        benefitsInKind,
        gbp(taxFreePayToEndOfPeriod),
        taxUnpaidDueToRegulatoryLimit,
      );
    } else {
      result = this.calculateTaxDueCumulativeNonFixedCode(
        totalTaxableSalaryInPeriod,
        benefitsInKind,
        taxableSalaryYearToDate,
        taxPaidYearToDate,
        gbp(taxFreePayToEndOfPeriod),
        taxUnpaidDueToRegulatoryLimit,
      );
    }

    result.taxFreePayForPeriod = gbp(taxFreePayToEndOfPeriod);

    return result;
  }

  private calculateTaxDueCumulativeNonFixedCode(
    totalTaxableSalaryInPeriod: Money,
    benefitsInKind: Money,
    taxableSalaryYearToDate: Money,
    taxPaidYearToDate: Money,
    taxFreePayToEndOfPeriod: Money,
    taxUnpaidDueToRegulatoryLimit: Money,
  ): InternalTaxCalculationResult {
    const totalTaxableSalaryYtd = totalTaxableSalaryInPeriod.add(
      taxableSalaryYearToDate,
    );

    const taxableSalaryAfterAllowance = totalTaxableSalaryYtd
      .subtract(taxFreePayToEndOfPeriod)
      .round(0, RoundDown);

    const refundAllowed = taxPaidYearToDate.greaterThan(
      taxFreePayToEndOfPeriod,
    );

    const applicableEntry = this.taxBandwidths.taxBandwidthEntries.find(
      (entry) =>
        taxableSalaryAfterAllowance
          .amount()
          .lte(entry.cumulativeBandwidth.round(0, RoundUp)) || entry.isTopBand,
    );

    if (!applicableEntry) {
      throw new InvalidReferenceDataException(
        `No applicable tax bandwidth found for taxable pay of ${totalTaxableSalaryYtd}`,
      );
    }

    const cumulativeBandwidthBelow =
      applicableEntry.bandWidthEntryBelow?.cumulativeBandwidth ??
      zeroGbp.amount();
    const cumulativeTaxBelow =
      applicableEntry.bandWidthEntryBelow?.cumulativeTax ?? zeroGbp.amount();

    const applicableRate = applicableEntry.rate ?? zeroGbp;

    const taxableSalaryAfterAllowanceRounded = totalTaxableSalaryYtd
      .subtract(taxFreePayToEndOfPeriod)
      .round(0, RoundDown)
      .amount();

    const taxableSalaryAtThisBand = taxableSalaryAfterAllowanceRounded.sub(
      cumulativeBandwidthBelow,
    );
    const taxAtThisBand = taxableSalaryAtThisBand.mul(applicableRate);
    const taxDueToEndOfPeriod = cumulativeTaxBelow.add(taxAtThisBand);

    const roundedTaxDueToEndOfPeriod = gbp(
      taxDueToEndOfPeriod.round(2, RoundDown),
    );

    // Ensure that we don't refund tax the employee hasn't paid
    const taxDue = roundedTaxDueToEndOfPeriod.lessThan(zeroGbp)
      ? refundAllowed
        ? roundedTaxDueToEndOfPeriod
        : zeroGbp
      : roundedTaxDueToEndOfPeriod;

    const taxPayable = taxDue.subtract(taxPaidYearToDate);

    const result: InternalTaxCalculationResult = {
      taxDueBeforeRegulatoryLimit: taxPayable,
      highestApplicableTaxBandIndex: applicableEntry.entryIndex,
      incomeAtHighestApplicableBand: gbp(taxableSalaryAtThisBand),
      taxAtHighestApplicableBand: gbp(taxAtThisBand),
      taxableSalary: gbp(taxableSalaryAfterAllowanceRounded),
      taxFreePayForPeriod: zeroGbp,
      finalTaxDue: zeroGbp,
      taxInExcessOfRegulatoryLimit: zeroGbp,
    };

    return this.processRegulatoryLimit(
      totalTaxableSalaryInPeriod,
      benefitsInKind,
      taxUnpaidDueToRegulatoryLimit,
      result,
    );
  }

  private CalculateTaxDueNonCumulativeNonFixedCode(
    totalTaxableSalaryInPeriod: Money,
    benefitsInKind: Money,
    taxFreePayToEndOfPeriod: Money,
    taxUnpaidDueToRegulatoryLimit: Money,
  ): InternalTaxCalculationResult {
    const taxableSalaryAfterAllowance = totalTaxableSalaryInPeriod.subtract(
      taxFreePayToEndOfPeriod,
    );

    const applicableEntry = this.taxBandwidths.taxBandwidthEntries.find(
      (entry) =>
        taxableSalaryAfterAllowance
          .amount()
          .lte(entry.period1CumulativeBandwidth.round(0, RoundUp)) ||
        entry.isTopBand,
    );

    if (!applicableEntry) {
      throw new InvalidReferenceDataException(
        `No applicable tax bandwidth found for taxable pay of ${taxableSalaryAfterAllowance}`,
      );
    }

    const cumulativeBandwidthBelow =
      applicableEntry.bandWidthEntryBelow?.period1CumulativeBandwidth ??
      zeroGbp.amount();
    const cumulativeTaxBelow =
      applicableEntry.bandWidthEntryBelow?.period1CumulativeTax ??
      zeroGbp.amount();

    const applicableRate = applicableEntry.rate ?? zeroGbp;

    const taxableSalaryAfterAllowanceRounded =
      taxableSalaryAfterAllowance.round(0, RoundDown);

    const taxableSalaryAtThisBand = taxableSalaryAfterAllowanceRounded
      .amount()
      .sub(cumulativeBandwidthBelow);
    const taxAtThisBand = taxableSalaryAtThisBand.mul(applicableRate);
    const taxDue = cumulativeTaxBelow.add(taxAtThisBand);

    let taxPayable = taxDue.round(2, 0);

    let taxInExcessOfRegulatoryLimit = zeroGbp.amount();
    const maxTaxPayableDueToRegulatoryLimit = totalTaxableSalaryInPeriod
      .amount()
      .sub(benefitsInKind.amount())
      .div(2);

    if (taxPayable.gt(maxTaxPayableDueToRegulatoryLimit)) {
      taxInExcessOfRegulatoryLimit = taxPayable.sub(
        maxTaxPayableDueToRegulatoryLimit,
      );
      taxPayable = maxTaxPayableDueToRegulatoryLimit;
    }

    const result: InternalTaxCalculationResult = {
      taxDueBeforeRegulatoryLimit: gbp(taxPayable),
      highestApplicableTaxBandIndex: applicableEntry.entryIndex,
      incomeAtHighestApplicableBand: gbp(taxableSalaryAtThisBand),
      taxAtHighestApplicableBand: gbp(taxAtThisBand),
      taxableSalary: zeroGbp,
      taxFreePayForPeriod: zeroGbp,
      finalTaxDue: zeroGbp,
      taxInExcessOfRegulatoryLimit: zeroGbp,
    };

    return this.processRegulatoryLimit(
      totalTaxableSalaryInPeriod,
      benefitsInKind,
      taxUnpaidDueToRegulatoryLimit,
      result,
    );
  }

  private calculateTaxDueOnFixedTaxCode(
    taxableSalary: Money,
    taxCode: TaxCode,
    taxableSalaryYearToDate: Money,
    taxPaidYearToDate: Money,
    benefitsInKind: Money,
    taxUnpaidDueToRegulatoryLimit: Money,
  ): InternalTaxCalculationResult {
    let effectiveTaxableSalary = taxableSalary;
    let bandIndex = 0;
    let taxDue = zeroGbp;
    let taxRate = Big(0);

    switch (taxCode.taxTreatment) {
      case TaxTreatment.NT:
        effectiveTaxableSalary = zeroGbp;
        taxDue = taxCode.isNonCumulative
          ? zeroGbp
          : zeroGbp.subtract(taxPaidYearToDate);
        break;

      case TaxTreatment.BR:
      case TaxTreatment.D0:
      case TaxTreatment.D1:
      case TaxTreatment.D2:
        bandIndex = TaxTreatmentExtensions.getBandIndex(
          taxCode.taxTreatment,
          taxCode.applicableCountries,
        );
        if (bandIndex >= this.taxBandwidths.taxBandwidthEntries.length) {
          throw new InconsistentDataException(
            `Tax code ${taxCode.taxTreatment} invalid for tax year/countries combination`,
          );
        }
        taxRate = this.taxBandwidths.taxBandwidthEntries[bandIndex].rate;
        taxDue = taxCode.isNonCumulative
          ? taxableSalary.round(0, RoundDown).multiply(taxRate)
          : taxableSalaryYearToDate
              .add(taxableSalary)
              .round(0, RoundDown)
              .multiply(taxRate)
              .subtract(taxPaidYearToDate);
        break;
    }

    const result: InternalTaxCalculationResult = {
      taxDueBeforeRegulatoryLimit: taxDue,
      highestApplicableTaxBandIndex: bandIndex,
      incomeAtHighestApplicableBand: effectiveTaxableSalary,
      taxAtHighestApplicableBand: gbp(taxRate),
      taxableSalary: zeroGbp,
      taxFreePayForPeriod: zeroGbp,
      finalTaxDue: zeroGbp,
      taxInExcessOfRegulatoryLimit: zeroGbp,
    };

    return this.processRegulatoryLimit(
      taxableSalary,
      benefitsInKind,
      taxUnpaidDueToRegulatoryLimit,
      result,
    );
  }

  private processRegulatoryLimit(
    totalTaxableSalaryInPeriod: Money,
    benefitsInKind: Money,
    taxUnpaidDueToRegulatoryLimit: Money,
    result: InternalTaxCalculationResult,
  ): InternalTaxCalculationResult {
    if (result.taxDueBeforeRegulatoryLimit.lessThan(zeroGbp)) {
      result.finalTaxDue = result.taxDueBeforeRegulatoryLimit;
      result.taxInExcessOfRegulatoryLimit = zeroGbp;

      return result;
    }

    const maxTaxPayableDueToRegulatoryLimit = totalTaxableSalaryInPeriod
      .subtract(benefitsInKind)
      .divide(2);

    if (
      result.taxDueBeforeRegulatoryLimit.greaterThan(
        maxTaxPayableDueToRegulatoryLimit,
      )
    ) {
      result.taxInExcessOfRegulatoryLimit =
        result.taxDueBeforeRegulatoryLimit.subtract(
          maxTaxPayableDueToRegulatoryLimit,
        );
      result.finalTaxDue = maxTaxPayableDueToRegulatoryLimit;

      return result;
    }

    if (taxUnpaidDueToRegulatoryLimit.greaterThan(zeroGbp)) {
      const maximumTaxDue = result.taxDueBeforeRegulatoryLimit.add(
        taxUnpaidDueToRegulatoryLimit,
      );
      result.finalTaxDue = maximumTaxDue.lessThanOrEqual(
        maxTaxPayableDueToRegulatoryLimit,
      )
        ? maximumTaxDue
        : maxTaxPayableDueToRegulatoryLimit;
      result.taxInExcessOfRegulatoryLimit = maximumTaxDue.greaterThan(
        maxTaxPayableDueToRegulatoryLimit,
      )
        ? maximumTaxDue.subtract(maxTaxPayableDueToRegulatoryLimit)
        : zeroGbp;
    } else {
      result.finalTaxDue = result.taxDueBeforeRegulatoryLimit;
      result.taxInExcessOfRegulatoryLimit = zeroGbp;
    }

    return result;
  }
}

interface InternalTaxCalculationResult {
  taxableSalary: Money;
  taxFreePayForPeriod: Money;
  taxDueBeforeRegulatoryLimit: Money;
  finalTaxDue: Money;
  highestApplicableTaxBandIndex: number;
  incomeAtHighestApplicableBand: Money;
  taxAtHighestApplicableBand: Money;
  taxInExcessOfRegulatoryLimit: Money;
}
