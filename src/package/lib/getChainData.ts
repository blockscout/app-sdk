import { API_CONFIG } from "../config";
import { defaultCurrencyUnits } from "./chain";

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export interface ChainData {
  explorerUrl: string;
  explorerLogo: string;
  currencySymbol: string;
  currencyWeiName: string;
}

interface CachedChainData extends ChainData {
  timestamp: number;
}

export const getCachedChainData = (chainId: string): CachedChainData | null => {
  const cached = localStorage.getItem(`chain_data_${chainId}`);
  if (!cached) return null;

  try {
    const data: CachedChainData = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`chain_data_${chainId}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

export const setCachedChainData = (chainId: string, data: ChainData) => {
  const cacheData: CachedChainData = {
    ...data,
    timestamp: Date.now(),
  };
  localStorage.setItem(`chain_data_${chainId}`, JSON.stringify(cacheData));
};

export const fetchChainData = async (
  chainId: string,
  signal?: AbortSignal,
): Promise<ChainData> => {
  // Try to get cached data first
  const cachedData = getCachedChainData(chainId);
  if (cachedData) {
    return cachedData;
  }

  // Fetch fresh data if not in cache
  const response = await fetch(
    `${API_CONFIG.CHAINS_API.BASE_URL}${API_CONFIG.CHAINS_API.ENDPOINTS.CHAIN(chainId)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch chain data for chain ID ${chainId}`);
  }

  const data = await response.json();
  const explorerUrl = data.explorers?.[0]?.url;
  const explorerLogo = data.logo;
  const currencySymbol = data.native_currency || defaultCurrencyUnits.ether;
  const currencyWeiName = defaultCurrencyUnits.wei;

  if (!explorerUrl) {
    throw new Error(`No explorer URL found for chain ID ${chainId}`);
  }

  if (!currencySymbol) {
    throw new Error(`No currency symbol found for chain ID ${chainId}`);
  }

  const cleanExplorerUrl = explorerUrl.replace(/\/$/, "");

  const chainData = {
    explorerUrl: cleanExplorerUrl,
    explorerLogo: explorerLogo || "",
    currencySymbol,
    currencyWeiName,
  };

  // Cache the new data
  setCachedChainData(chainId, chainData);

  return chainData;
};
