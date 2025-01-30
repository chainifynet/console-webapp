import useSWR from "swr";
import { useTokenSilently } from "../useTokenSilently";
import { postFetcherFn } from "./common";

export function useFeeEstimate(assetId: string, from: string) {
  const getAccessTokenSilently = useTokenSilently();

  const url = `/estimatefee`;
  const body = { assetId, from };

  const { data, error, isLoading } = useSWR(
    () => (assetId && from ? [url, body] : null),
    postFetcherFn(getAccessTokenSilently),
    {
      shouldRetryOnError: false,
      refreshInterval: 60_000, // refresh every 1 minute
    }
  );

  return <{ data: FeeEstimate; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}

export interface FeeEstimate {
  amount: number | string;
  assetId: string;
}
