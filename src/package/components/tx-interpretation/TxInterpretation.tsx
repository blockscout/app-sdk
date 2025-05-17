import styled from "styled-components";
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
import { defaultCurrencyUnits } from "package/lib/chain";
import TxInterpretationChunk from "./TxInterpretationChunk";
import { NonStringTxInterpretationVariable } from "./types";
import React from "react";

const Root = styled.div`
  display: flex;
  align-items: flex-start;
  white-space: pre;
  flex-wrap: wrap;
  color: rgba(16, 17, 18, 0.8);
`;

const BoldText = styled.span`
  font-weight: 600;
`;

const PreText = styled.span`
  white-space: pre;
`;

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
    <Root className={className}>
      {chunks.map((chunk, index) => {
        const variableName = variablesNames[index];
        let content = null;
        if (variableName === NATIVE_COIN_SYMBOL_VAR_NAME) {
          content = (
            <BoldText>
              {(currencyData?.symbol || defaultCurrencyUnits.ether) + " "}
            </BoldText>
          );
        } else if (variableName === WEI_VAR_NAME) {
          content = (
            <BoldText>
              {(currencyData?.weiName || defaultCurrencyUnits.wei) + " "}
            </BoldText>
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
            <PreText>
              {chunk.trim() + (chunk.trim() && variableName ? " " : "")}
            </PreText>
            {index < variablesNames.length && content}
          </React.Fragment>
        );
      })}
    </Root>
  );
};

export default TxInterpretation;
