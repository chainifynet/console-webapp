import { Account, GasStation } from "../../../types/types";
import { useAuthFetcherGet } from "./common";
import useSWR from "swr";

export function useGasStations() {
  const fetcher = useAuthFetcherGet();
  const { data, error, isLoading } = useSWR(`/gas-stations`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return <{ data: GasStations; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}

interface GasStations {
  gasStations: GasStation[];
}
