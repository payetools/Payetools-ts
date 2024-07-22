// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { TestDataRepository } from "../TestDataRepository";
import { IEndToEndTestDataSet } from "./IEndToEndTestDataSet";

export class EndToEndTestDataSource {
  public static getAllData(): IEndToEndTestDataSet {
    const db = new TestDataRepository();

    return {
      deductionDefinitions: db.getDeductionDefinitionsData(),
      earningsDefinitions: db.getEarningsDefinitionsData(),
      expectedOutputs: db.getExpectedOutputsData(),
      periodInputs: db.getPeriodInputsData(),
      previousYtdInputs: db.getPreviousYtdInputsData(),
      staticInputs: db.getStaticInputsData(),
      niYtdHistory: db.getNiYtdHistoryData(),
      pensionSchemes: db.getPensionSchemesData(),
      payRunInfo: db.getPayRunInfoData(),
    };
  }
}
