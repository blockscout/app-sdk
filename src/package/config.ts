export const API_CONFIG = {
  CHAINS_API: {
    BASE_URL: "https://chains.blockscout.com/api",
    ENDPOINTS: {
      CHAIN: (chainId: string) => `/chains/${chainId}`,
    },
  },
  EXPLORER_API: {
    ENDPOINTS: {
      TRANSACTION: (hash: string) => `/api/v2/transactions/${hash}`,
      TRANSACTION_SUMMARY: (hash: string) =>
        `/api/v2/transactions/${hash}/summary`,
      ADDRESS_TRANSACTIONS: (hash: string) =>
        `/api/v2/addresses/${hash}/transactions`,
      ALL_TRANSACTIONS: () => `/api/v2/transactions`,
    },
  },
} as const;

export const APP_CONFIG = {
  URLS: {
    TRANSACTION: (hash: string) => `/tx/${hash}`,
    ADDRESS: (hash: string) => `/address/${hash}`,
    TOKEN: (hash: string) => `/token/${hash}`,
    ADDRESS_TRANSACTIONS: (hash: string) => `/address/${hash}?tab=txs`,
    ALL_TRANSACTIONS: () => `/txs`,
  },
} as const;
