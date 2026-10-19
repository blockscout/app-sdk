// SPDX-License-Identifier: LicenseRef-Blockscout

import {
  TxInterpretationVariable,
  TxInterpretationVariableString,
} from "package/api/types/tx-interpretation";

export type NonStringTxInterpretationVariable = Exclude<
  TxInterpretationVariable,
  TxInterpretationVariableString
>;
