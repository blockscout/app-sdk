import Link from "package/components/link/Link";
import "package/index.css";
import Age from "package/components/age/Age";
import Address from "package/components/address/Address";
import Token from "package/components/token/Token";
import { useTxToast } from "package/components/tx-toast/useTxToast";
import { useEffect, useState } from "react";
import { ToastProvider } from "package/components/toast/ToastProvider";

// Example transaction hashes
const TX_HASHES = {
  ethereum: [
    "0x5e9beca18c46289e92c7ce6c930a1496c5ed24994cfdd00acb61880ebcf3b593",
    "0x6e9beca18c46289e92c7ce6c930a1496c5ed24994cfdd00acb61880ebcf3b594",
    "0x7e9beca18c46289e92c7ce6c930a1496c5ed24994cfdd00acb61880ebcf3b595",
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
  const { openTxToast } = useTxToast();
  const [pendingTxs, setPendingTxs] = useState<string[]>([]);

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
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
