import useSWR from "swr";
import { ApiKey } from "../../../types/types";
import { useAuthFetcherGet } from "./common";

export function useApiKey(apiKeyId: string) {
  const fetcher = useAuthFetcherGet((res: any) => res?.data?.apikey);
  const { data, error, isLoading } = useSWR(apiKeyId ? `/apikeys/${apiKeyId}` : null, fetcher, {
    shouldRetryOnError: false,
  });

  return <{ data: ApiKey; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}
