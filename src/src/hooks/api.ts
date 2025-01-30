import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { Vault, type Tx, type Wallet } from "../../types/types";
import { apiUrl } from "../constants";
import { useTokenSilently } from "./useTokenSilently";

const getAuthFetcher = (getAccessTokenSilently: () => Promise<string>) => async (url: string) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(apiUrl + url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

// ==================================================================================
const useVaultsGetKey = (pageIndex: number, previousPageData: { last: string }) => {
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) {
    return `/vaults`;
  }
  // reached the end
  if (!previousPageData?.last) {
    return null;
  }
  // add the cursor to the API endpoint
  return `/vaults?last=${previousPageData.last}`; // SWR key
};

/**
 * Will fetch vaults
 */
export function useVaults() {
  const getAccessTokenSilently = useTokenSilently();

  const fetcher = getAuthFetcher(getAccessTokenSilently);
  const { data, error, isLoading, size, setSize } = useSWRInfinite(useVaultsGetKey, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return <UseVaultsResult>{
    data,
    isLoading,
    error,
    size,
    setSize,
    isEnd: !data || !data[data.length - 1]?.last,
  };
}

type UseVaultssData = {
  vaults: Vault[];
  last?: string;
};

type UseVaultsResult = {
  data?: UseVaultssData[];
  error?: Error;
  isLoading: boolean;
  size: number;
  setSize: (size: number) => void;
  isEnd: boolean;
};

// ==================================================================================
/**
 * Will fetch one vault
 */
export function useVault(vaultId = "") {
  const getAccessTokenSilently = useTokenSilently();

  const fetcher = getAuthFetcher(getAccessTokenSilently);
  const { data, error, isLoading } = useSWR(`/vaults/${vaultId}`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return <{ data: Vault; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}

// ==================================================================================
/**
 * Will fetch one wallets
 */
export function useWallet(vaultId: string, walletId: string) {
  const getAccessTokenSilently = useTokenSilently();

  const fetcher = getAuthFetcher(getAccessTokenSilently);
  const { data, error, isLoading } = useSWR(`/vaults/${vaultId}/wallets/${walletId}`, fetcher, {
    shouldRetryOnError: false,
  });

  return <{ data: Wallet; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}

// ==================================================================================

const useTxsGetKey = (vaultId: string, walletId: string) => (pageIndex: number, previousPageData: { last: string }) => {
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `/vaults/${vaultId}/wallets/${walletId}/txs`;
  // reached the end
  if (!previousPageData?.last) return null;
  // add the cursor to the API endpoint
  return `/vaults/${vaultId}/wallets/${walletId}/txs?last=${previousPageData.last}`; // SWR key
};

/**
 * Fetches the transactions for a wallet
 */
export function useTxs(vaultId = "", walletId = "") {
  const getAccessTokenSilently = useTokenSilently();

  const fetcher = getAuthFetcher(getAccessTokenSilently);
  const { data, error, isLoading, size, setSize } = useSWRInfinite(useTxsGetKey(vaultId, walletId), fetcher, {
    shouldRetryOnError: false,
  });

  return <UseTxsResult>{
    data,
    isLoading,
    error,
    size,
    setSize,
    isEnd: !data || !data[data.length - 1]?.last,
  };
}

type UseTxsResult = {
  data?: {
    transactions: Tx[];
    last?: string;
  }[];
  error?: Error;
  isLoading: boolean;
  size: number;
  setSize: (size: number) => void;
  isEnd: boolean;
};
