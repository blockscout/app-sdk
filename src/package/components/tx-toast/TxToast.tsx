import React, { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../toast/Toast";
import { API_CONFIG } from "package/api/config";
import type { Transaction } from "package/api/types/tx";

type ChainConfig = {
  apiUrl: string;
};

// Cache for chain configurations
const chainConfigCache = new Map<string, ChainConfig>();

async function fetchChainConfig(chainId: string): Promise<ChainConfig> {
  // Check cache first
  const cached = chainConfigCache.get(chainId);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(
      `${API_CONFIG.CHAINS_API.BASE_URL}${API_CONFIG.CHAINS_API.ENDPOINTS.CHAIN(chainId)}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch chain data for chain ID ${chainId}`);
    }

    const data = await response.json();

    if (!data.explorers?.[0]?.url) {
      throw new Error(`No explorer URL found for chain ID ${chainId}`);
    }

    const config: ChainConfig = {
      apiUrl: data.explorers[0].url,
    };

    // Cache the result
    chainConfigCache.set(chainId, config);
    return config;
  } catch (error) {
    console.error("Error fetching chain config:", error);
    throw error;
  }
}

async function fetchTransactionData(
  apiUrl: string,
  hash: string,
): Promise<Transaction> {
  // const response = await fetch(`${apiUrl}${API_CONFIG.EXPLORER_API.ENDPOINTS.TRANSACTION(hash)}`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch transaction data');
  // }
  // return response.json();
  console.log("fetchTransactionData");
  console.log("apiUrl", apiUrl);
  console.log("hash", hash);
  return {
    status: "ok",
  };
}

interface TxToastProps {
  chainId: string;
  hash: string;
}

export const TxToast: React.FC<TxToastProps> = ({ chainId, hash }) => {
  const { open, update, close } = useToast();
  const [toastId, setToastId] = useState<string | null>(null);
  const pollingInterval = useRef<number | null>(null);
  const chainConfigRef = useRef<ChainConfig | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingInterval.current) {
      window.clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    if (toastId) {
      close(toastId);
    }
  }, [close, toastId]);

  const checkTransactionStatus = useCallback(async () => {
    try {
      if (!chainConfigRef.current?.apiUrl) return;

      const txData = await fetchTransactionData(
        chainConfigRef.current.apiUrl,
        hash,
      );

      console.log("txData", txData);

      // if (txData.status === null) {
      //   // Transaction is still pending
      //   update(toastId!, {
      //     title: 'Transaction is pending',
      //     content: 'Awaiting confirmation',
      //     bottomLink: (
      //       <a
      //         href={`${chainConfigRef.current.apiUrl}/tx/${hash}`}
      //         target="_blank"
      //         rel="noopener noreferrer"
      //       >
      //         View on Explorer
      //       </a>
      //     )
      //   });
      // } else if (txData.status === 'ok') {
      //   // Transaction succeeded
      //   stopPolling();
      //   update(toastId!, {
      //     title: 'Transaction successful',
      //     content: 'Your transaction has been confirmed',
      //     bottomLink: (
      //       <a
      //         href={`${chainConfigRef.current.apiUrl}/tx/${hash}`}
      //         target="_blank"
      //         rel="noopener noreferrer"
      //       >
      //         View on Explorer
      //       </a>
      //     )
      //   });
      // } else {
      //   // Transaction failed
      //   stopPolling();
      //   update(toastId!, {
      //     title: 'Transaction failed',
      //     content: 'Failed to find executed transaction',
      //     bottomLink: (
      //       <a
      //         href={`${chainConfigRef.current.apiUrl}/tx/${hash}`}
      //         target="_blank"
      //         rel="noopener noreferrer"
      //       >
      //         View on Explorer
      //       </a>
      //     )
      //   });
      // }
    } catch (error) {
      console.error("Failed to fetch transaction status:", error);
      // stopPolling();
      // update(toastId!, {
      //   title: 'Transaction failed',
      //   content: 'Failed to find executed transaction',
      //   bottomLink: (
      //     <a
      //       href={`${chainConfigRef.current?.apiUrl}/tx/${hash}`}
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       View on Explorer
      //     </a>
      //   )
      // });
    }
  }, [hash, toastId, update, stopPolling]);

  useEffect(() => {
    const initializeToast = async () => {
      // Create initial toast first
      const id = open({
        title: "Transaction is pending",
        content: "Waiting for Blockscout response",
      });
      setToastId(id);

      try {
        // Then fetch chain config
        chainConfigRef.current = await fetchChainConfig(chainId);

        // Start polling only after we have the config
        await checkTransactionStatus();
        pollingInterval.current = window.setInterval(
          checkTransactionStatus,
          5000,
        );
      } catch (error) {
        console.error("Failed to initialize toast:", error);
        if (id) {
          close(id);
        }
      }
    };

    initializeToast();

    return () => {
      stopPolling();
      if (toastId) {
        close(toastId);
      }
    };
  }, [chainId, hash]);

  return null;
};
