import { Account } from "../../../types/types";
import { useAuthFetcherGet } from "./common";
import useSWRInfinite from "swr/infinite";

const getKey = (vaultId: string) => (pageIndex: number, previousPageData: Data) => {
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) {
    return `/vaults/${vaultId}/accounts`;
  }
  // reached the end
  if (!previousPageData?.last) {
    return null;
  }
  // add the cursor to the API endpoint
  return `/vaults/${vaultId}/accounts?last=${previousPageData.last}`;
};

/**
 * Will fetch accounts for a vault
 */
export function useAccounts(vaultId: string) {
  const fetcher = useAuthFetcherGet();
  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey(vaultId), fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return <Result>{
    data,
    isLoading,
    error,
    size,
    setSize,
    isEnd: !data || !data[data.length - 1]?.last,
  };
}

type Data = {
  accounts: Account[];
  last?: string;
};

type Result = {
  data?: Data[];
  error?: Error;
  isLoading: boolean;
  size: number;
  setSize: (size: number) => void;
  isEnd: boolean;
};
