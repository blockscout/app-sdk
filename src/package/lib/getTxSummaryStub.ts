import { AddressParam } from "../api/types/address";

export const getTxSummaryStub = (
  from: AddressParam,
  method: string,
  to: AddressParam | null,
) => {
  return {
    summary_template: `{sender_hash} called {method} ${to ? "on {receiver_hash}" : ""}`,
    summary_template_variables: {
      sender_hash: {
        type: "address",
        value: from,
      },
      method: {
        type: "method",
        value: method,
      },
      receiver_hash: {
        type: "address",
        value: to,
      },
    },
  };
};
