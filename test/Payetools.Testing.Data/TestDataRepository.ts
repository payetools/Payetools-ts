// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import fs from "node:fs";
import { JsonConvert } from "json2typescript";
import { HmrcIncomeTaxTestDataEntry } from "./IncomeTax/HmrcIncomeTaxTestDataEntry";
import { IHmrcIncomeTaxTestDataEntry } from "./IncomeTax/IHmrcIncomeTaxTestDataEntry";
import { DeductionsTestDataEntry } from "./EndToEnd/DeductionsTestDataEntry";
import { PensionSchemesTestDataEntry } from "./EndToEnd/PensionSchemesTestDataEntry";
import { PayRunInfoTestDataEntry } from "./EndToEnd/PayrunInfoTestDataEntry";
import { ExpectedOutputTestDataEntry } from "./EndToEnd/ExpectedOutputTestDataEntry";
import { NiYtdHistoryTestDataEntry } from "./EndToEnd/NiYtdHistoryTestDataEntry";
import { StaticInputTestDataEntry } from "./EndToEnd/StaticInputTestDataEntry";
import { EarningsTestDataEntry } from "./EndToEnd/EarningsTestDataEntry";
import { PeriodInputTestDataEntry } from "./EndToEnd/PeriodInputTestDataEntry";
import { PreviousYtdTestDataEntry } from "./EndToEnd/PreviousYtdTestDataEntry";
import { IDeductionsTestDataEntry } from "./EndToEnd/IDeductionsTestDataEntry";
import { IEarningsTestDataEntry } from "./EndToEnd/IEarningsTestDataEntry";
import { IExpectedOutputTestDataEntry } from "./EndToEnd/IExpectedOutputTestDataEntry";
import { INiYtdHistoryTestDataEntry } from "./EndToEnd/INiYtdHistoryTestDataEntry";
import { IPeriodInputTestDataEntry } from "./EndToEnd/IPeriodInputTestDataEntry";
import { IPreviousYtdTestDataEntry } from "./EndToEnd/IPreviousYtdTestDataEntry";
import { IStaticInputTestDataEntry } from "./EndToEnd/IStaticInputTestDataEntry";
import { IPensionSchemesTestDataEntry } from "./EndToEnd/IPensionSchemesTestDataEntry";
import { IPayRunInfoTestDataEntry } from "./EndToEnd/IPayrunInfoTestDataEntry";
import { IHmrcDirectorsNiTestDataEntry } from "./NationalInsurance/IHmrcDirectorsNiTestDataEntry";
import { HmrcDirectorsNiTestDataEntry } from "./NationalInsurance/HmrcDirectorsNiTestDataEntry";
import { HmrcNiTestDataEntry } from "./NationalInsurance/HmrcNiTestDataEntry";
import { IHmrcNiTestDataEntry } from "./NationalInsurance/IHmrcNiTestDataEntry";

export class TestDataRepository {
  private readonly _jsonConvert = new JsonConvert();

  public getIncomeTaxData(): IHmrcIncomeTaxTestDataEntry[] {
    return this.getTestDataFromFile<IHmrcIncomeTaxTestDataEntry>(
      "HMRC_IncomeTax",
      HmrcIncomeTaxTestDataEntry,
    );
  }
  public getHmrcNationalInsuranceData(): IHmrcNiTestDataEntry[] {
    return this.getTestDataFromFile<IHmrcNiTestDataEntry>(
      "HMRC_NationalInsurance",
      HmrcNiTestDataEntry,
    );
  }
  public getHmrcDirectorsNationalInsuranceData(): IHmrcDirectorsNiTestDataEntry[] {
    return this.getTestDataFromFile<IHmrcDirectorsNiTestDataEntry>(
      "HMRC_Directors_NationalInsurance",
      HmrcDirectorsNiTestDataEntry,
    );
  }

  public getDeductionDefinitionsData(): IDeductionsTestDataEntry[] {
    return this.getTestDataFromFile<IDeductionsTestDataEntry>(
      "Paytools_EndToEnd_Deductions",
      DeductionsTestDataEntry,
    );
  }
  public getEarningsDefinitionsData(): IEarningsTestDataEntry[] {
    return this.getTestDataFromFile<IEarningsTestDataEntry>(
      "Paytools_EndToEnd_Earnings",
      EarningsTestDataEntry,
    );
  }
  public getExpectedOutputsData(): IExpectedOutputTestDataEntry[] {
    return this.getTestDataFromFile<IExpectedOutputTestDataEntry>(
      "Paytools_EndToEnd_ExpectedOutput",
      ExpectedOutputTestDataEntry,
    );
  }
  public getPeriodInputsData(): IPeriodInputTestDataEntry[] {
    return this.getTestDataFromFile<IPeriodInputTestDataEntry>(
      "Paytools_EndToEnd_PeriodInput",
      PeriodInputTestDataEntry,
    );
  }
  public getPreviousYtdInputsData(): IPreviousYtdTestDataEntry[] {
    return this.getTestDataFromFile<IPreviousYtdTestDataEntry>(
      "Paytools_EndToEnd_PreviousYTD",
      PreviousYtdTestDataEntry,
    );
  }
  public getStaticInputsData(): IStaticInputTestDataEntry[] {
    return this.getTestDataFromFile<IStaticInputTestDataEntry>(
      "Paytools_EndToEnd_StaticInput",
      StaticInputTestDataEntry,
    );
  }
  public getNiYtdHistoryData(): INiYtdHistoryTestDataEntry[] {
    return this.getTestDataFromFile<INiYtdHistoryTestDataEntry>(
      "Paytools_EndToEnd_NIYTDHistory",
      NiYtdHistoryTestDataEntry,
    );
  }
  public getPensionSchemesData(): IPensionSchemesTestDataEntry[] {
    return this.getTestDataFromFile<IPensionSchemesTestDataEntry>(
      "Paytools_EndToEnd_PensionSchemes",
      PensionSchemesTestDataEntry,
    );
  }
  public getPayRunInfoData(): IPayRunInfoTestDataEntry[] {
    return this.getTestDataFromFile<IPayRunInfoTestDataEntry>(
      "Paytools_EndToEnd_PayrunInfo",
      PayRunInfoTestDataEntry,
    );
  }

  private getTestDataFromFile<T extends object>(
    collectionName: string,
    classReference: {
      new (): T;
    },
  ): T[] {
    const filePath = `${__dirname}/Db/${collectionName}.json`;

    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);

    return this._jsonConvert.deserializeArray<T>(json, classReference);
  }
}
