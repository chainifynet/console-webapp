import { useAuthFetcherGet } from "./common";
import useSWR from "swr";

export function useMetrics() {
  const fetcher = useAuthFetcherGet((m: any) => m?.metrics);
  const { data, error, isLoading } = useSWR(`/metrics`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return <{ data: ComposedMetrics; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}

export enum Metric {
  ACCOUNT_COUNT = "ACCOUNT_COUNT",
  VAULT_COUNT = "VAULT_COUNT",
  USER_COUNT = "USER_COUNT",
}
export type ComposedMetrics = Record<
  Metric,
  {
    count: number;
    max?: number;
    name: Metric;
  }
>;
