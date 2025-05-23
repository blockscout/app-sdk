# Blockscout App SDK

A React SDK for integrating Blockscout transaction notifications and transaction history into your dApp.

## Features

- Transaction Toast Notifications
- Transaction History Popup
- Transaction interpretation and summaries
- Support for multiple chains
- Mobile-responsive design

## Installation

```bash
npm install @blockscout/app-sdk
# or
yarn add @blockscout/app-sdk
```

## Usage

### 1. Transaction Toast Notifications

The transaction toast feature provides real-time notifications for transaction status updates. It shows pending, success, and error states with detailed transaction information.

#### Setup

Wrap your application with the `NotificationProvider`:

```tsx
import { NotificationProvider } from "@blockscout/app-sdk";

function App() {
  return (
    <NotificationProvider>
      <YourApp />
    </NotificationProvider>
  );
}
```

#### Using Transaction Toast

```tsx
import { useNotification } from "@blockscout/app-sdk";

function YourComponent() {
  const { openTxToast } = useNotification();

  const handleTransaction = async (txHash) => {
    try {
      // Your transaction logic here
      await sendTransaction();

      // Show transaction toast
      openTxToast("1", txHash); // '1' is the chain ID for Ethereum mainnet
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <button onClick={() => handleTransaction("0x123...")}>
      Send Transaction
    </button>
  );
}
```

### 2. Transaction History Popup

The transaction history popup allows users to view recent transactions for a specific address or all transactions on a chain.

#### Setup

Wrap your application with the `TransactionPopupProvider`:

```tsx
import { TransactionPopupProvider } from "@blockscout/app-sdk";

function App() {
  return (
    <TransactionPopupProvider>
      <YourApp />
    </TransactionPopupProvider>
  );
}
```

#### Using Transaction Popup

```tsx
import { useTransactionPopup } from "@blockscout/app-sdk";

function YourComponent() {
  const { openPopup } = useTransactionPopup();

  // Show transactions for a specific address
  const showAddressTransactions = () => {
    openPopup({
      chainId: "1", // Ethereum mainnet
      address: "0x123...", // Optional: specific address
    });
  };

  // Show all transactions for a chain
  const showAllTransactions = () => {
    openPopup({
      chainId: "1", // Ethereum mainnet
    });
  };

  return (
    <div>
      <button onClick={showAddressTransactions}>
        View Address Transactions
      </button>
      <button onClick={showAllTransactions}>View All Transactions</button>
    </div>
  );
}
```

## Features

### Transaction Toast

- Real-time status updates (pending, success, error)
- Transaction interpretation and summaries
- Links to block explorer
- Automatic status polling
- Error handling with revert reasons

### Transaction Popup

- View recent transactions
- Filter by address
- Transaction status indicators
- Transaction interpretation
- Links to block explorer
- Mobile-responsive design
- Loading states and error handling

## Chain Compatibility

The SDK is compatible with any blockchain that has a Blockscout explorer instance with API v2 support. These chains are listed in the [Chainscout](https://chains.blockscout.com/). To verify if your target chain is supported, visit our [compatibility checker](https://sdk-compatibility.blockscout.com/).

Here are some common supported chain IDs:

- `1`: Ethereum Mainnet
- `137`: Polygon Mainnet
- `42161`: Arbitrum One
- `10`: Optimism

## API Reference

### useNotification Hook

```typescript
const { openTxToast } = useNotification();

// Open a transaction toast
openTxToast(chainId: string, hash: string): Promise<void>
```

### useTransactionPopup Hook

```typescript
const { openPopup } = useTransactionPopup();

// Open transaction popup
openPopup(options: {
  chainId: string;
  address?: string;
}): void
```

## Contributing

This project is currently closed for external contributions. We appreciate your interest, but we are not accepting pull requests at this time.

## License

MIT
