import type { AddressParam } from "./address";

export interface DecodedInput {
  method_call: string;
  method_id: string;
  parameters: Array<DecodedInputParams>;
}

export interface DecodedInputParams {
  name: string;
  type: string;
  value: string | Array<unknown> | Record<string, unknown>;
  indexed?: boolean;
}

export type TransactionRevertReason =
  | {
      raw: string;
    }
  | DecodedInput;

export type Transaction = {
  to: AddressParam | null;
  created_contract: AddressParam | null;
  hash: string;
  result: string;
  confirmations: number;
  status: "ok" | "error" | null | undefined;
  block_number: number | null;
  timestamp: string | null;
  confirmation_duration: Array<number> | null;
  from: AddressParam;
  value: string;
  revert_reason: TransactionRevertReason | null;
  gas_price: string | null;
  type: number | null;
  gas_used: string | null;
  gas_limit: string;
  max_fee_per_gas: string | null;
  max_priority_fee_per_gas: string | null;
  priority_fee: string | null;
  base_fee_per_gas: string | null;
  transaction_burnt_fee: string | null;
  nonce: number;
  position: number | null;
  raw_input: string;
  token_transfers_overflow: boolean;
  exchange_rate: string | null;
  method: string | null;
  transaction_tag: string | null;
  l1_fee?: string;
  l1_fee_scalar?: string;
  l1_gas_price?: string;
  l1_gas_used?: string;
  has_error_in_internal_transactions: boolean | null;
};
