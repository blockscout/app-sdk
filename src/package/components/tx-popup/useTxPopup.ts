import { useContext } from "react";
import { TxPopupContext } from "./TxPopupContext";

export const useTransactionPopup = () => {
  const ctx = useContext(TxPopupContext);
  if (!ctx)
    throw new Error(
      "useTransactionPopup must be used within TransactionPopupProvider",
    );
  return ctx;
};
