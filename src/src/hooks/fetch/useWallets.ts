import { Wallet } from "../../../types/types";
import { useAuthFetcherGet } from "./common";
import useSWRInfinite from "swr/infinite";

const getKey = (params: Params) => (pageIndex: number, previousPageData: Data) => {
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) {
    if (params.address) {
      return `/wallets?address=${params.address}`;
    } else if (params.accountId) {
      return `/wallets?account=${params.accountId}`;
    } else {
      return `/wallets`;
    }
  }
  // reached the end
  if (!previousPageData?.last) {
    return null;
  }
  // add the cursor to the API endpoint
  if (params.address) {
    return `/wallets?address=${params.address}&last=${previousPageData.last}`;
  } else if (params.accountId) {
    return `/wallets?account=${params.accountId}&last=${previousPageData.last}`;
  } else {
    return `/wallets?last=${previousPageData.last}`;
  }
};

/**
 * Will fetch wallets
 */
export function useWallets(params: Params = {}) {
  const fetcher = useAuthFetcherGet();
  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey(params), fetcher, {
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

type Params = {
  address?: string;
  accountId?: string;
};

type Data = {
  wallets: Wallet[];
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
