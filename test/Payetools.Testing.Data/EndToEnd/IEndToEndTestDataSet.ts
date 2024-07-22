// Copyright (c) 2023-2024, Payetools Foundation.
//
// Payetools Foundation licenses this file to you under the following license(s):
//
//   * The MIT License, see https://opensource.org/license/mit/

import { IDeductionsTestDataEntry } from "./IDeductionsTestDataEntry";
import { IEarningsTestDataEntry } from "./IEarningsTestDataEntry";
import { IExpectedOutputTestDataEntry } from "./IExpectedOutputTestDataEntry";
import { INiYtdHistoryTestDataEntry } from "./INiYtdHistoryTestDataEntry";
import { IPeriodInputTestDataEntry } from "./IPeriodInputTestDataEntry";
import { IPreviousYtdTestDataEntry } from "./IPreviousYtdTestDataEntry";
import { IStaticInputTestDataEntry } from "./IStaticInputTestDataEntry";
import { IPensionSchemesTestDataEntry } from "./IPensionSchemesTestDataEntry";
import { IPayRunInfoTestDataEntry } from "./IPayrunInfoTestDataEntry";

export interface IEndToEndTestDataSet {
  deductionDefinitions: IDeductionsTestDataEntry[];
  earningsDefinitions: IEarningsTestDataEntry[];
  expectedOutputs: IExpectedOutputTestDataEntry[];
  periodInputs: IPeriodInputTestDataEntry[];
  previousYtdInputs: IPreviousYtdTestDataEntry[];
  staticInputs: IStaticInputTestDataEntry[];
  niYtdHistory: INiYtdHistoryTestDataEntry[];
  pensionSchemes: IPensionSchemesTestDataEntry[];
  payRunInfo: IPayRunInfoTestDataEntry[];
}
