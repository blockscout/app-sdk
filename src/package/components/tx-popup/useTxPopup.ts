import { useContext } from "react";
import { TxPopupContext } from "./TxPopupContext";

export const useTxPopup = () => {
  const ctx = useContext(TxPopupContext);
  if (!ctx) throw new Error("useTxPopup must be used within TxPopupProvider");
  return ctx;
};
