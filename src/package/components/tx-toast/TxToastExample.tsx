import React from "react";
import { useTxToast } from "./useTxToast";

export const TxToastExample: React.FC = () => {
  const { createToast } = useTxToast();

  const handleTransaction = async () => {
    // Example chain ID and transaction hash
    const chainId = "1"; // Ethereum mainnet
    const hash = "0x123..."; // Replace with actual transaction hash

    const toast = createToast(chainId);
    await toast.open({ hash });
  };

  return <button onClick={handleTransaction}>Show Transaction Status</button>;
};
