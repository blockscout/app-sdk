import React, { useCallback, useState } from "react";
import { TxPopupContext, TxPopupOptions } from "./TxPopupContext";
import { TxPopup } from "./TxPopup";

export const TransactionPopupProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [popupOptions, setPopupOptions] = useState<TxPopupOptions | null>(null);

  const openPopup = useCallback((options: TxPopupOptions) => {
    setPopupOptions(options);
  }, []);

  const closePopup = useCallback(() => {
    setPopupOptions(null);
  }, []);

  return (
    <TxPopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      {popupOptions && (
        <TxPopup
          chainId={popupOptions.chainId}
          address={popupOptions.address}
          onClose={closePopup}
        />
      )}
    </TxPopupContext.Provider>
  );
};
