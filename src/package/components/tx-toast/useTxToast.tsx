import React from "react";
import { useToast } from "../toast/useToast";
import { API_CONFIG } from "package/config";
import hexToUtf8 from "../../lib/hexToUtf8";
import { AddressParam } from "package/api/types/address";
import { Transaction } from "package/api/types/tx";
import TxInterpretation from "../tx-interpretation/TxInterpretation";
import TxToastFooter from "./TxToastFooter";
import { ChainData, fetchChainData } from "package/lib/getChainData";
import { checkSummary } from "../tx-interpretation/utils";
const HEX_REGEXP = /^(?:0x)?[\da-fA-F]+$/;

const getTxSummaryStub = (
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

export function useNotification() {
  const { open, close, update } = useToast();
  const pollingRef = React.useRef<Map<string, number>>(new Map());
  const abortControllerRef = React.useRef<Map<string, AbortController>>(
    new Map(),
  );
  const chainDataRef = React.useRef<Map<string, ChainData>>(new Map());

  // Add cleanup effect
  React.useEffect(() => {
    return () => {
      // Clean up all polling intervals and abort controllers when component unmounts
      pollingRef.current.forEach((intervalId) => {
        clearInterval(intervalId);
      });
      pollingRef.current.clear();

      abortControllerRef.current.forEach((controller) => {
        controller.abort();
      });
      abortControllerRef.current.clear();
    };
  }, []);

  const stopPolling = React.useCallback((toastId: string) => {
    const intervalId = pollingRef.current.get(toastId);
    if (intervalId) {
      clearInterval(intervalId);
      pollingRef.current.delete(toastId);
    }

    const controller = abortControllerRef.current.get(toastId);
    if (controller) {
      controller.abort();
      abortControllerRef.current.delete(toastId);
    }
  }, []);

  const checkTransactionStatus = React.useCallback(
    async (
      toastId: string,
      explorerUrl: string,
      hash: string,
      chainId: string,
    ) => {
      try {
        const controller = new AbortController();
        abortControllerRef.current.set(toastId, controller);

        const cleanExplorerUrl = explorerUrl.endsWith("/")
          ? explorerUrl.slice(0, -1)
          : explorerUrl;
        const txResponse = await fetch(
          `${cleanExplorerUrl}${API_CONFIG.EXPLORER_API.ENDPOINTS.TRANSACTION(hash)}`,
          {
            signal: controller.signal,
          },
        );

        if (!txResponse.ok) {
          if (txResponse.status === 404) {
            update(toastId, {
              title: "Looking for the transaction",
              status: "pending",
              content: "Waiting for transaction to be indexed",
            });
            return;
          }
          update(toastId, {
            title: "Transaction is failed",
            status: "error",
            content: "Failed to fetch transaction data",
          });
          stopPolling(toastId);
          return;
        }

        const txData = (await txResponse.json()) as Transaction;
        if (txData.status === null) {
          update(toastId, {
            title: "Transaction is pending... ",
            status: "pending",
            content: "Awaiting confirmation",
          });
        } else if (txData.status === "ok") {
          const summaryResponse = await fetch(
            `${cleanExplorerUrl}${API_CONFIG.EXPLORER_API.ENDPOINTS.TRANSACTION_SUMMARY(hash)}`,
            {
              signal: controller.signal,
            },
          );

          let summary;
          if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json();
            summary = summaryData?.data?.summaries?.[0];
          } else if (txData.method) {
            summary = getTxSummaryStub(txData.from, txData.method, txData.to);
          }

          let content: React.ReactNode = "Transaction confirmed";

          if (summary && checkSummary(summary)) {
            const chainData = chainDataRef.current.get(chainId);
            const currencyData = chainData
              ? {
                  symbol: chainData.currencySymbol,
                  weiName: chainData.currencyWeiName,
                }
              : undefined;

            content = (
              <TxInterpretation
                summary={summary}
                addressDataMap={{
                  [txData.from.hash]: txData.from,
                  ...(txData.to && txData.to.hash
                    ? { [txData.to.hash]: txData.to }
                    : {}),
                }}
                currencyData={currencyData}
                explorerUrl={cleanExplorerUrl}
              />
            );
          }
          const viewTransactionLink = (
            <TxToastFooter
              timestamp={txData.timestamp}
              hash={hash}
              explorerLogo={chainDataRef.current.get(chainId)?.explorerLogo}
              cleanExplorerUrl={cleanExplorerUrl}
            />
          );

          update(toastId, {
            title: "Transaction is complete",
            status: "success",
            content: (
              <>
                <div style={{ wordBreak: "break-word", overflow: "hidden" }}>
                  {content}
                </div>
                {viewTransactionLink}
              </>
            ),
          });
          stopPolling(toastId);
        } else if (txData.status === "error") {
          const revertReason = txData.revert_reason;
          let content;
          if (revertReason && "raw" in revertReason && revertReason.raw) {
            if (HEX_REGEXP.test(revertReason.raw)) {
              content = `Revert reason: ${hexToUtf8(revertReason.raw)}`;
            } else {
              content = `Revert reason: ${revertReason.raw}`;
            }
          } else if (revertReason && "method_call" in revertReason) {
            content = `Revert reason: ${revertReason.method_call}`;
          } else {
            content = txData.result
              ? `Result: ${txData.result}`
              : "Transaction reverted";
          }

          const viewTransactionLink = (
            <TxToastFooter
              timestamp={txData.timestamp}
              hash={hash}
              explorerLogo={chainDataRef.current.get(chainId)?.explorerLogo}
              cleanExplorerUrl={cleanExplorerUrl}
            />
          );

          update(toastId, {
            title: "Transaction is failed",
            status: "error",
            content: (
              <>
                <div style={{ wordBreak: "break-word", overflow: "hidden" }}>
                  {content}
                </div>
                {viewTransactionLink}
              </>
            ),
          });
          stopPolling(toastId);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error checking transaction status:", error);
        update(toastId, {
          title: "Something went wrong",
          content: "Failed to check transaction status",
        });
        stopPolling(toastId);
      }
    },
    [update, stopPolling],
  );

  const openTxToast = React.useCallback(
    async (chainId: string, hash: string) => {
      const id = open({
        title: "Loading...",
        status: "pending",
        content: "Waiting for Blockscout response",
        onClose: () => {
          stopPolling(id);
        },
      });

      try {
        const controller = new AbortController();
        abortControllerRef.current.set(id, controller);

        const chainData = await fetchChainData(chainId);
        chainDataRef.current.set(chainId, chainData);

        // Initial check
        await checkTransactionStatus(id, chainData.explorerUrl, hash, chainId);

        // Start polling if status is null
        const intervalId = window.setInterval(() => {
          checkTransactionStatus(id, chainData.explorerUrl, hash, chainId);
        }, 5000);

        pollingRef.current.set(id, intervalId);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error in openTxToast:", error);
        close(id);
        throw error;
      }
    },
    [open, close, checkTransactionStatus, stopPolling],
  );

  return {
    openTxToast,
  };
}
