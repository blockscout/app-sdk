import Link from "package/components/link/Link";
import Age from "package/components/age/Age";
import Address from "package/components/address/Address";
import Token from "package/components/token/Token";
import { useNotification } from "package/components/tx-toast/useTxToast";
import { useEffect, useState } from "react";
import { NotificationProvider } from "package/components/toast/ToastProvider";
import { useTransactionPopup } from "package/components/tx-popup/useTxPopup";
import { TransactionPopupProvider } from "package/components/tx-popup/TxPopupProvider";
import "../index.css";

// Example transaction hashes
const TX_HASHES = {
  ethereum: [
    "0x5e9beca18c46289e92c7ce6c930a1496c5ed24994cfdd00acb61880ebcf3b593",
    "0x6e9beca18c46289e92c7ce6c930a1496c5ed24994cfdd00acb61880ebcf3b594",
    "0x8b8e4e74d63d309498595d012abcc4feef399bff8443cfb64c4cb2b0559ca421",
  ],
  polygon: [
    "0x7e9beca18c46289e92c7ce6c930a1496c5ed24994cfdd00acb61880ebcf3b593",
    "0x8e9beca18c46289e92c7ce6c930a1496c5ed24994cfdd00acb61880ebcf3b594",
  ],
  arbitrum: [
    "0x8e9beca18c46289e92c7ce6c930a1496c5ed24994cfdd00acb61880ebcf3b593",
  ],
};

function AppContent() {
  const { openTxToast } = useNotification();
  const [pendingTxs, setPendingTxs] = useState<string[]>([]);

  // TxPopup demo logic
  const { openPopup } = useTransactionPopup();
  const [popupChainId, setPopupChainId] = useState("1");
  const [popupAddress, setPopupAddress] = useState("");

  const showPopupFor = (chainId: string, address?: string) => {
    openPopup({ chainId, address });
  };

  const showToast = (hash: string) => {
    openTxToast("1", hash);
  };

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        const response = await fetch(
          "https://eth.blockscout.com/api/v2/transactions?filter=pending",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pending transactions");
        }

        const data = await response.json();
        // Take first 3 transactions
        const firstThreeTxs = data.items
          .slice(0, 3)
          .map((tx: { hash: string }) => tx.hash);
        setPendingTxs(firstThreeTxs);
      } catch (error) {
        console.error("Error fetching pending transactions:", error);
      }
    };

    fetchPendingTransactions();
  }, []);

  return (
    <>
      {/* TxPopup Demo UI */}
      <div style={{ marginBottom: 32 }}>
        <h3>TxPopup Examples</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button
            onClick={() =>
              showPopupFor("1", "0x00000000219ab540356cBB839Cbe05303d7705Fa")
            }
          >
            Open Popup: 0x000...05Fa
          </button>
          <button
            onClick={() =>
              showPopupFor("1", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
            }
          >
            Open Popup: 0xC02...6Cc2
          </button>
          <button
            onClick={() =>
              showPopupFor("1", "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8")
            }
          >
            Open Popup: 0xBE0...3E8
          </button>
        </div>
        <button onClick={() => showPopupFor("1")}>
          Open Popup: All Transactions (chain 1)
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Chain ID"
            value={popupChainId}
            onChange={(e) => setPopupChainId(e.target.value)}
            style={{ width: 80 }}
          />
          <input
            type="text"
            placeholder="Address (optional)"
            value={popupAddress}
            onChange={(e) => setPopupAddress(e.target.value)}
            style={{ width: 320 }}
          />
          <button
            onClick={() =>
              showPopupFor(popupChainId, popupAddress || undefined)
            }
          >
            Open Popup
          </button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h3>Pending Transactions</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            {pendingTxs.map((hash, index) => (
              <button key={hash} onClick={() => showToast(hash)}>
                Show Pending Tx {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3>Example Transactions</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            {TX_HASHES.ethereum.map((hash, index) => (
              <button key={hash} onClick={() => showToast(hash)}>
                Show Example Tx {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link href="https://eth.blockscout.com">Link</Link>
        <Address
          hash="0xa8FCe579a11E551635b9c9CB915BEcd873C51254"
          explorerUrl="https://eth.blockscout.com"
        />
        <Token
          hash="0xa8FCe579a11E551635b9c9CB915BEcd873C51254"
          symbol="USDT"
          icon="https://assets.coingecko.com/coins/images/325/small/Tether.png?1696501661"
          explorerUrl="https://eth.blockscout.com"
        />
        <Age timestamp={(Date.now() - 1000 * 60 * 60 * 24 * 30).toString()} />
      </div>
    </>
  );
}

export function App() {
  return (
    <NotificationProvider>
      <TransactionPopupProvider>
        <AppContent />
      </TransactionPopupProvider>
    </NotificationProvider>
  );
}
