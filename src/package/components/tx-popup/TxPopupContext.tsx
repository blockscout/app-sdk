import { createContext } from "react";

export interface TxPopupOptions {
  chainId: string;
  address?: string;
}

export interface TxPopupContextType {
  openPopup: (options: TxPopupOptions) => void;
  closePopup: () => void;
}

export const TxPopupContext = createContext<TxPopupContextType | null>(null);
