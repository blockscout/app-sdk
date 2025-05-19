import React, { useState, useEffect } from "react";
import styled from "styled-components";
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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;
`;

const Container = styled.div`
  display: flex;
  width: 728px;
  max-width: 95vw;
  padding: var(--Space-Sections-3, 24px);
  flex-direction: column;
  align-items: flex-start;
  gap: var(--Space-Sections-3, 24px);
  border-radius: 12px;
  background: var(--background-for-themes-white, #fff);
  box-shadow:
    0px 10px 15px -3px rgba(0, 0, 0, 0.1),
    0px 4px 6px -2px rgba(0, 0, 0, 0.05);
  position: relative;

  @media (max-width: 600px) {
    width: 90vw;
    max-width: 90vw;
    min-width: 0;
    padding: 12px;
    align-items: center;
    justify-content: center;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(51, 54, 52, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #1a1a1a;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 32px;
`;

const Error = styled.div`
  color: #bd4d45;
  margin-bottom: 16px;
`;

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

const TransactionItem = styled.div`
  display: flex;
  background: #fff;
  padding: 16px 0 8px 0;
  justify-content: space-between;
  line-height: 22px;

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 12px 0 4px 0;
  }
`;

const Divider = styled.hr`
  height: 1px;
  background: #ececec;
  width: 100%;
  margin: 0;
  border: none;
  display: none;

  @media (max-width: 600px) {
    display: block;
  }
`;

const TransactionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 600px) {
    align-items: flex-start;
    gap: 10px;
  }
`;

const StatusIconWrapper = styled.div<{
  status: "pending" | "success" | "error";
}>`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
  background: ${({ status }) =>
    status === "pending"
      ? "rgba(51, 54, 52, 0.05)"
      : status === "success"
        ? "#ebfbf1"
        : "#fee2e2"};
  color: ${({ status }) =>
    status === "pending"
      ? "rgba(59, 66, 126, 0.6)"
      : status === "success"
        ? "#329d6b"
        : "#bd4d45"};

  @media (max-width: 600px) {
    width: 22px;
    height: 22px;
  }
`;

const TransactionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TransactionHash = styled.div`
  font-size: 16px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const TransactionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 44px;

  @media (max-width: 600px) {
    gap: 8px;
    margin-left: 32px;
    margin-top: 4px;
    align-self: end;
  }
`;

const Timestamp = styled.div`
  font-size: 13px;
  color: #a0a3ad;
  font-weight: 400;
`;

const ExplorerLink = styled(Link)`
  color: #596699;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const ExplorerLogo = styled.img`
  margin-right: 4px;
`;

const ViewAllLink = styled.div`
  width: 100%;
  margin-top: 8px;
  font-size: 14px;
`;

interface TxPopupProps {
  chainId: string;
  address?: string;
  onClose: () => void;
}

type TxWithSummary = {
  tx: Transaction;
  summary: TxInterpretationSummary | null;
  status: "pending" | "success" | "error";
};

export function TxPopup({ chainId, address, onClose }: TxPopupProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [txs, setTxs] = useState<TxWithSummary[]>([]);
  const [chainData, setChainData] = useState<ChainData | null>(null);

  useEffect(() => {
    let abort = false;
    const fetchAll = async () => {
      if (abort) return;
      setLoading(true);
      setError(null);
      setTxs([]);

      try {
        // 1. Fetch chain data
        const data = await fetchChainData(chainId);
        if (abort) return;
        setChainData(data);

        // 2. Fetch transactions
        const txUrl = address
          ? `${data.explorerUrl}${API_CONFIG.EXPLORER_API.ENDPOINTS.ADDRESS_TRANSACTIONS(address)}`
          : `${data.explorerUrl}${API_CONFIG.EXPLORER_API.ENDPOINTS.ALL_TRANSACTIONS()}`;

        const txResp = await fetch(txUrl);
        if (abort) return;
        if (!txResp.ok) {
          setError("Failed to fetch transactions");
          return;
        }
        const txData = await txResp.json();
        const items: Transaction[] = txData.items?.slice(0, 5) || [];

        // 3. For each transaction, fetch summary/interpretation
        const txsWithSummaries: TxWithSummary[] = await Promise.all(
          items.map(async (tx) => {
            let summary = null;
            let status: "pending" | "success" | "error" = "success";

            // Only fetch summary for successful transactions
            if (tx.status === "ok") {
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
            }

            if (tx.status === null) status = "pending";
            else if (tx.status === "error") status = "error";
            return { tx, summary, status };
          }),
        );
        if (abort) return;
        setTxs(txsWithSummaries);
      } catch (e: unknown) {
        if (abort) return;
        const error = e as { message?: string };
        setError(error.message || "Unknown error occurred");
      } finally {
        if (!abort) {
          setLoading(false);
        }
      }
    };
    fetchAll();
    return () => {
      abort = true;
    };
  }, [chainId, address]);

  return (
    <Overlay>
      <Container>
        <Header>
          <Title>
            Recent transaction{" "}
            {address ? `for ${address.slice(0, 4)}...${address.slice(-4)}` : ""}
          </Title>
          <CloseButton onClick={onClose} aria-label="Close">
            {/* @ts-expect-error SVG component props not properly typed */}
            <IconClose width={24} height={24} />
          </CloseButton>
        </Header>
        {loading ? (
          <LoadingContainer>
            <Spinner size={48} />
          </LoadingContainer>
        ) : error ? (
          <Error>{error}</Error>
        ) : txs.length === 0 ? (
          <div>No transactions found.</div>
        ) : (
          <TransactionsList>
            {txs.map(({ tx, summary, status }, idx) => (
              <React.Fragment key={tx.hash}>
                <TransactionItem>
                  <TransactionRow>
                    <StatusIconWrapper status={status}>
                      <StatusIcon
                        status={status}
                        tx={tx}
                        searchAddress={address}
                      />
                    </StatusIconWrapper>
                    <TransactionContent>
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
                        <TransactionHash>
                          Transaction {tx.hash.slice(0, 12)}...
                          {tx.hash.slice(-4)}
                        </TransactionHash>
                      )}
                    </TransactionContent>
                  </TransactionRow>
                  <TransactionMeta>
                    {tx.timestamp && (
                      <Timestamp>
                        <Age timestamp={tx.timestamp} />
                      </Timestamp>
                    )}
                    <ExplorerLink
                      href={
                        chainData?.explorerUrl +
                        APP_CONFIG.URLS.TRANSACTION(tx.hash)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on explorer"
                    >
                      <ExplorerLogo
                        src={chainData?.explorerLogo}
                        alt="Explorer"
                        width={20}
                        height={20}
                      />{" "}
                      ↗
                    </ExplorerLink>
                  </TransactionMeta>
                </TransactionItem>
                {idx < txs.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </TransactionsList>
        )}
        <ViewAllLink>
          <Link href={APP_CONFIG.URLS.ALL_TRANSACTIONS()}>
            View all transactions in the block explorer
          </Link>
        </ViewAllLink>
      </Container>
    </Overlay>
  );
}
