import useSWR from "swr";
import { GasStation } from "../../../types/types";
import { useAuthFetcherGet } from "./common";

export function useGasStation(assetId: string) {
  const fetcher = useAuthFetcherGet();
  const { data, error, isLoading } = useSWR(`/gas-stations/${assetId}`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return <{ data: GasStation; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}
