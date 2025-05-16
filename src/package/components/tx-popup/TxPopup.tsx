import { useState, useCallback, useEffect } from "react";
import Spinner from "../spinner/Spinner";
import TxInterpretation from "../tx-interpretation/TxInterpretation";
import { getTxSummaryStub } from "package/lib/getTxSummaryStub";
import { API_CONFIG, APP_CONFIG } from "package/config";
import { Transaction } from "package/api/types/tx";
import { TxInterpretationSummary } from "package/api/types/tx-interpretation";
import { ChainData, fetchChainData } from "package/lib/getChainData";
import IconClose from "package/assets/icons/close.svg";
import Link from "../link/Link";
import Age from "../age/Age";
import StatusIcon from "./StatusIcon";
import styles from "./TxPopup.module.css";

interface TxPopupProps {
  chainId: string;
  address?: string;
}

type TxWithSummary = {
  tx: Transaction;
  summary: TxInterpretationSummary | null;
  status: "pending" | "success" | "error";
};

export function useTxPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState<TxPopupProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txs, setTxs] = useState<TxWithSummary[]>([]);
  const [chainData, setChainData] = useState<ChainData | null>(null);

  const openModal = useCallback((chainId: string, address?: string) => {
    setParams({ chainId, address });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setParams(null);
    setTxs([]);
    setChainData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isOpen || !params) return;
    let abort = false;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch chain data
        const data = await fetchChainData(params.chainId);
        if (abort) return;
        setChainData(data);
        console.log("data", data);
        // 2. Fetch transactions
        const txUrl = params.address
          ? `${data.explorerUrl}${API_CONFIG.EXPLORER_API.ENDPOINTS.ADDRESS_TRANSACTIONS(params.address)}`
          : `${data.explorerUrl}${API_CONFIG.EXPLORER_API.ENDPOINTS.ALL_TRANSACTIONS()}`;
        console.log("txUrl", txUrl);
        const txResp = await fetch(txUrl);
        if (!txResp.ok) throw new Error("Failed to fetch transactions");
        const txData = await txResp.json();
        const items: Transaction[] = txData.items?.slice(0, 5) || [];
        // 3. For each transaction, fetch summary/interpretation
        const txsWithSummaries: TxWithSummary[] = await Promise.all(
          items.map(async (tx) => {
            let summary = null;
            let status: "pending" | "success" | "error" = "success";
            try {
              const summaryResp = await fetch(
                `${data.explorerUrl}${API_CONFIG.EXPLORER_API.ENDPOINTS.TRANSACTION_SUMMARY(tx.hash)}`,
              );
              if (summaryResp.ok) {
                const summaryData = await summaryResp.json();
                summary = summaryData?.data?.summaries?.[0];
              }
              if (!summary && tx.method) {
                summary = getTxSummaryStub(tx.from, tx.method, tx.to);
              }
            } catch {
              if (tx.method)
                summary = getTxSummaryStub(tx.from, tx.method, tx.to);
            }
            if (tx.status === null) status = "pending";
            else if (tx.status === "error") status = "error";
            return { tx, summary, status };
          }),
        );
        if (abort) return;
        setTxs(txsWithSummaries);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    return () => {
      abort = true;
    };
  }, [isOpen, params]);

  const Popup =
    isOpen && params ? (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Recent transaction{" "}
              {params.address
                ? `for ${params.address.slice(0, 4)}...${params.address.slice(-4)}`
                : ""}
            </h2>
            <button
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Close"
            >
              {/* @ts-expect-error SVG component props not properly typed */}
              <IconClose width={24} height={24} />
            </button>
          </div>
          {loading && (
            <div className={styles.loadingContainer}>
              <Spinner size={48} />
            </div>
          )}
          {error && <div className={styles.error}>{error}</div>}
          {!loading && !error && txs.length === 0 && (
            <div>No transactions found.</div>
          )}
          <div className={styles.transactionsList}>
            {txs.map(({ tx, summary, status }, idx) => (
              <>
                <div key={tx.hash} className={styles.transactionItem}>
                  <div className={styles.transactionRow}>
                    <div
                      className={`${styles.statusIcon} ${styles[`statusIcon${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}
                    >
                      <StatusIcon
                        status={status}
                        tx={tx}
                        searchAddress={params.address}
                      />
                    </div>
                    <div className={styles.transactionContent}>
                      {summary ? (
                        <TxInterpretation
                          summary={summary}
                          addressDataMap={{
                            [tx.from.hash]: tx.from,
                            ...(tx.to && tx.to.hash
                              ? { [tx.to.hash]: tx.to }
                              : {}),
                          }}
                          currencyData={
                            chainData
                              ? {
                                  symbol: chainData.currencySymbol,
                                  weiName: chainData.currencyWeiName,
                                }
                              : undefined
                          }
                          explorerUrl={chainData?.explorerUrl || ""}
                        />
                      ) : (
                        <div className={styles.transactionHash}>
                          Transaction {tx.hash.slice(0, 12)}...
                          {tx.hash.slice(-4)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.transactionMeta}>
                    {tx.timestamp && (
                      <div className={styles.timestamp}>
                        <Age timestamp={tx.timestamp} />
                      </div>
                    )}
                    <Link
                      href={
                        chainData?.explorerUrl +
                        APP_CONFIG.URLS.TRANSACTION(tx.hash)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.explorerLink}
                      title="View on explorer"
                    >
                      <img
                        src={chainData?.explorerLogo}
                        alt="Explorer"
                        width={20}
                        height={20}
                        className={styles.explorerLogo}
                      />{" "}
                      ↗
                    </Link>
                  </div>
                </div>
                {idx < txs.length - 1 && <hr className={styles.divider} />}
              </>
            ))}
          </div>
          <div className={styles.viewAllLink}>
            <Link href={APP_CONFIG.URLS.ALL_TRANSACTIONS()}>
              View all transactions in the block explorer
            </Link>
          </div>
        </div>
      </div>
    ) : null;

  return { openModal, Popup };
}
