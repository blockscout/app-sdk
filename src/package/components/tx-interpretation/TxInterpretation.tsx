import { AddressParam } from "package/api/types/address";
import { TxInterpretationSummary } from "package/api/types/tx-interpretation";
import {
  checkSummary,
  extractVariables,
  fillStringVariables,
  getStringChunks,
  NATIVE_COIN_SYMBOL_VAR_NAME,
  WEI_VAR_NAME,
} from "./utils";
import style from "./TxInterpretation.module.css";
import classNames from "classnames";
import { currencyUnits } from "package/lib/chain";
import TxInterpretationChunk from "./TxInterpretationChunk";
import { NonStringTxInterpretationVariable } from "./types";

interface Props {
  summary: TxInterpretationSummary;
  addressDataMap: Record<string, AddressParam>;
  className?: string;
}

const TxInterpretation = ({ summary, addressDataMap, className }: Props) => {
  if (!summary) {
    return null;
  }

  const template = summary.summary_template;
  const variables = summary.summary_template_variables;

  if (!checkSummary(template, variables)) {
    return null;
  }

  const intermediateResult = fillStringVariables(template, variables);
  const variablesNames = extractVariables(intermediateResult);
  const chunks = getStringChunks(intermediateResult);

  return (
    <div className={classNames(style.root, className)}>
      {chunks.map((chunk, index) => {
        const variableName = variablesNames[index];
        let content = null;
        if (variableName === NATIVE_COIN_SYMBOL_VAR_NAME) {
          content = <span>{currencyUnits.ether + " "}</span>;
        } else if (variableName === WEI_VAR_NAME) {
          content = <span>{currencyUnits.wei + " "}</span>;
        } else if (variables[variableName]) {
          content = (
            <TxInterpretationChunk
              variable={
                variables[variableName] as NonStringTxInterpretationVariable
              }
              addressDataMap={addressDataMap}
            />
          );
        }
        return (
          <span key={chunk + index}>
            <span>
              {chunk.trim() + (chunk.trim() && variableName ? " " : "")}
            </span>
            {index < variablesNames.length && content}
          </span>
        );
      })}
    </div>
  );
};

export default TxInterpretation;
