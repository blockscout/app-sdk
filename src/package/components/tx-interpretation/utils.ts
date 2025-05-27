// we use that regex as a separator when splitting template and dont want to capture variables

import type {
  TxInterpretationSummary,
  TxInterpretationVariable,
} from "package/api/types/tx-interpretation";

export const VAR_REGEXP = /\{(?:[^}]+)\}/g;

export const NATIVE_COIN_SYMBOL_VAR_NAME = "native";
export const WEI_VAR_NAME = "wei";

export function extractVariables(templateString: string) {
  const matches = templateString.match(VAR_REGEXP);

  const variablesNames = matches
    ? matches.map((match) => match.slice(1, -1))
    : [];

  return variablesNames;
}

export function getStringChunks(template: string) {
  return template.split(VAR_REGEXP);
}

export function checkSummary(summary: TxInterpretationSummary) {
  const template = summary.summary_template;
  const variables = summary.summary_template_variables;

  const variablesNames = extractVariables(template);
  let result = true;
  for (const name of variablesNames) {
    if (name === NATIVE_COIN_SYMBOL_VAR_NAME || name === WEI_VAR_NAME) {
      continue;
    }
    if (
      !variables[name] ||
      variables[name].value === undefined ||
      variables[name].value === null
    ) {
      result = false;
      break;
    }
  }

  return result;
}

export function fillStringVariables(
  template: string,
  variables: Record<string, TxInterpretationVariable>,
) {
  const variablesNames = extractVariables(template);

  let result = template;
  variablesNames.forEach((name) => {
    if (variables[name] && variables[name].type === "string") {
      result = result.replace(`{${name}}`, variables[name].value as string);
    }
  });

  return result;
}
