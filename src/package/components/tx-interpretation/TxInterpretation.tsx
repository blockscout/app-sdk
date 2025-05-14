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
import { defaultCurrencyUnits } from "package/lib/chain";
import TxInterpretationChunk from "./TxInterpretationChunk";
import { NonStringTxInterpretationVariable } from "./types";
import React from "react";

interface Props {
  summary: TxInterpretationSummary;
  addressDataMap?: Record<string, AddressParam>;
  className?: string;
  currencyData?: {
    symbol: string;
    weiName: string;
  };
  explorerUrl: string;
}

const TxInterpretation = ({
  summary,
  addressDataMap,
  className,
  currencyData,
  explorerUrl,
}: Props) => {
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
          content = (
            <span style={{ fontWeight: 600 }}>
              {currencyData?.symbol || defaultCurrencyUnits.ether + " "}
            </span>
          );
        } else if (variableName === WEI_VAR_NAME) {
          content = (
            <span style={{ fontWeight: 600 }}>
              {currencyData?.weiName || defaultCurrencyUnits.wei + " "}
            </span>
          );
        } else if (variables[variableName]) {
          content = (
            <TxInterpretationChunk
              variable={
                variables[variableName] as NonStringTxInterpretationVariable
              }
              addressDataMap={addressDataMap}
              explorerUrl={explorerUrl}
            />
          );
        }
        return (
          <React.Fragment key={`chunk-${index}`}>
            <span style={{ whiteSpace: "pre" }}>
              {chunk.trim() + (chunk.trim() && variableName ? " " : "")}
            </span>
            {index < variablesNames.length && content}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TxInterpretation;
