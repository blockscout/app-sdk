import { toaster } from "package/components/toast/Toast";
import React from "react";
import TxToastFooter from "package/components/tx-toast/TxToastFooter";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function useTxToast() {
  const toastId = React.useRef<string | null>(null);

  const showToast = React.useCallback(
    (params: Parameters<typeof toaster.create>[0]) => {
      if (toastId.current) {
        toaster.update(toastId.current, params);
      } else {
        toastId.current = toaster.create(params);
      }
    },
    [],
  );

  const showLoading = React.useCallback(() => {
    showToast({
      type: "loading",
      title: "Transaction is pending",
      description: "We are checking your transaction status",
      duration: Infinity,
    });
  }, [showToast]);

  const showSuccess = React.useCallback(
    (hash: string) => {
      showToast({
        type: "success",
        title: "Transaction is completed",
        description: <div>Send 120 USDT to address 0x5F54...09321</div>,
        duration: 10_000,
        meta: {
          footer: <TxToastFooter timestamp={Date.now() - 10_000} hash={hash} />,
        },
      });
    },
    [showToast],
  );

  const showError = React.useCallback(
    (hash: string) => {
      showToast({
        type: "error",
        title: "Transaction failed",
        description: (
          <div>
            This transaction required additional operations, resulting in higher
            fees.
          </div>
        ),
        duration: 10_000,
        meta: {
          footer: <TxToastFooter timestamp={Date.now() - 10_000} hash={hash} />,
        },
      });
    },
    [showToast],
  );

  const open = React.useCallback(
    async (hash: string) => {
      showLoading();
      await delay(1_000);
      showSuccess(hash);
      await delay(5_000);
      showError(hash);
    },
    [showLoading, showSuccess, showError],
  );

  return React.useMemo(
    () => ({
      open,
    }),
    [open],
  );
}
