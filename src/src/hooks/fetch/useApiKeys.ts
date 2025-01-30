import { ApiKey } from "../../../types/types";
import { useAuthFetcherGet } from "./common";
import useSWR from "swr";

export function useApiKeys() {
  const fetcher = useAuthFetcherGet((r: any) => r.data.apikeys);
  const { data, error, isLoading } = useSWR(`/apikeys`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return <{ data: ApiKey[]; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}
