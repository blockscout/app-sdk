import React from "react";
import { useToast } from "../toast/useToast";
import { API_CONFIG, APP_CONFIG } from "package/config";
import hexToUtf8 from "../../lib/hexToUtf8";
import { AddressParam } from "package/api/types/address";
import { Transaction } from "package/api/types/tx";
import TxInterpretation from "../tx-interpretation/TxInterpretation";
import {
  NATIVE_COIN_SYMBOL_VAR_NAME,
  WEI_VAR_NAME,
} from "../tx-interpretation/utils";
import Link from "../link/Link";

const HEX_REGEXP = /^(?:0x)?[\da-fA-F]+$/;
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 1 day in milliseconds

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

interface CachedExplorerData {
  url: string;
  logo: string;
  timestamp: number;
}

interface CachedCurrencyData {
  symbol: string;
  weiName: string;
  timestamp: number;
}

const getCachedExplorerUrl = (
  chainId: string,
): { url: string; logo: string } | null => {
  const cached = localStorage.getItem(`explorer_url_${chainId}`);
  if (!cached) return null;

  try {
    const data: CachedExplorerData = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`explorer_url_${chainId}`);
      return null;
    }
    return { url: data.url, logo: data.logo };
  } catch {
    return null;
  }
};

const setCachedExplorerUrl = (chainId: string, url: string, logo: string) => {
  const data: CachedExplorerData = {
    url,
    logo,
    timestamp: Date.now(),
  };
  localStorage.setItem(`explorer_url_${chainId}`, JSON.stringify(data));
};

const getCachedCurrencyData = (
  chainId: string,
): { symbol: string; weiName: string } | null => {
  const cached = localStorage.getItem(`currency_data_${chainId}`);
  if (!cached) return null;

  try {
    const data: CachedCurrencyData = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`currency_data_${chainId}`);
      return null;
    }
    return { symbol: data.symbol, weiName: data.weiName };
  } catch {
    return null;
  }
};

const setCachedCurrencyData = (
  chainId: string,
  symbol: string,
  weiName: string,
) => {
  const data: CachedCurrencyData = {
    symbol,
    weiName,
    timestamp: Date.now(),
  };
  localStorage.setItem(`currency_data_${chainId}`, JSON.stringify(data));
};

export function useTxToast() {
  const { open, close, update } = useToast();
  const pollingRef = React.useRef<Map<string, number>>(new Map());
  const abortControllerRef = React.useRef<Map<string, AbortController>>(
    new Map(),
  );
  const currencyDataRef = React.useRef<
    Map<string, { symbol: string; weiName: string }>
  >(new Map());
  const explorerDataRef = React.useRef<
    Map<string, { url: string; logo: string }>
  >(new Map());

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
            console.log("summaryData", summaryData);
            summary = summaryData?.data?.summaries?.[0];
          } else if (txData.method) {
            summary = getTxSummaryStub(txData.from, txData.method, txData.to);
          }

          let content: React.ReactNode = "Transaction confirmed";

          if (summary) {
            // Check if we need to fetch currency data
            const needsCurrencyData =
              summary.summary_template_variables &&
              Object.values(summary.summary_template_variables).some(
                (v) =>
                  typeof v === "object" &&
                  v !== null &&
                  "type" in v &&
                  (v.type === NATIVE_COIN_SYMBOL_VAR_NAME ||
                    v.type === WEI_VAR_NAME),
              );

            let currencyData = currencyDataRef.current.get(chainId);

            if (needsCurrencyData) {
              if (!currencyData) {
                const cachedData = getCachedCurrencyData(chainId);
                if (cachedData) {
                  currencyData = cachedData;
                } else {
                  try {
                    const configResponse = await fetch(
                      `${cleanExplorerUrl}${APP_CONFIG.URLS.ENVS}`,
                    );
                    if (configResponse.ok) {
                      const configData = await configResponse.json();
                      currencyData = {
                        symbol:
                          configData.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL ||
                          "Eth",
                        weiName:
                          configData.NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME ||
                          "wei",
                      };
                      setCachedCurrencyData(
                        chainId,
                        currencyData.symbol,
                        currencyData.weiName,
                      );
                    } else {
                      currencyData = { symbol: "Eth", weiName: "wei" };
                    }
                  } catch (error) {
                    console.error("Error fetching currency data:", error);
                    currencyData = { symbol: "Eth", weiName: "wei" };
                  }
                }

                currencyDataRef.current.set(chainId, currencyData);
              }
            }

            const addressDataMap: Record<string, AddressParam> = {};
            [txData?.from, txData?.to]
              .filter((data): data is AddressParam =>
                Boolean(data && data.hash),
              )
              .forEach((data) => {
                addressDataMap[data.hash] = data;
              });

            content = (
              <TxInterpretation
                summary={summary}
                addressDataMap={addressDataMap}
                currencyData={currencyData}
                explorerUrl={cleanExplorerUrl}
              />
            );
          }

          const explorerData = explorerDataRef.current.get(chainId);
          const viewTransactionLink = (
            <Link
              href={`${cleanExplorerUrl}${APP_CONFIG.URLS.TRANSACTION(hash)}`}
              style={{ marginTop: "12px" }}
            >
              {explorerData?.logo && (
                <img
                  src={explorerData.logo}
                  alt="Explorer logo"
                  style={{ width: "20px", height: "20px", marginRight: "4px" }}
                />
              )}
              View on block explorer
            </Link>
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

          const explorerData = explorerDataRef.current.get(chainId);
          const viewTransactionLink = (
            <Link
              href={`${cleanExplorerUrl}${APP_CONFIG.URLS.TRANSACTION(hash)}`}
              style={{ marginTop: "12px" }}
            >
              {explorerData?.logo && (
                <img
                  src={explorerData.logo}
                  alt="Explorer logo"
                  style={{ width: "20px", height: "20px", marginRight: "4px" }}
                />
              )}
              View on block explorer
            </Link>
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

        // Check cache first
        let explorerData = getCachedExplorerUrl(chainId);

        if (!explorerData) {
          const response = await fetch(
            `${API_CONFIG.CHAINS_API.BASE_URL}${API_CONFIG.CHAINS_API.ENDPOINTS.CHAIN(chainId)}`,
            {
              signal: controller.signal,
            },
          );

          if (!response.ok) {
            close(id);
            throw new Error(
              `Failed to fetch chain data for chain ID ${chainId}`,
            );
          }

          const data = await response.json();
          const explorerUrl = data.explorers?.[0]?.url;
          const explorerLogo = data.logo;

          if (!explorerUrl) {
            close(id);
            throw new Error(`No explorer URL found for chain ID ${chainId}`);
          }

          // Cache the explorer data
          setCachedExplorerUrl(chainId, explorerUrl, explorerLogo || "");
          explorerData = { url: explorerUrl, logo: explorerLogo || "" };
        }

        explorerDataRef.current.set(chainId, explorerData);

        // Initial check
        await checkTransactionStatus(id, explorerData.url, hash, chainId);

        // Start polling if status is null
        const intervalId = window.setInterval(() => {
          checkTransactionStatus(id, explorerData.url, hash, chainId);
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
