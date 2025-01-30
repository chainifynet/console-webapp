import { Account } from "../../../types/types";
import { useAuthFetcherGet } from "./common";
import useSWR from "swr";

// TODO I don't really need the vault id: change the server for that
export function useAccount(vaultId: string, accountId: string) {
  const fetcher = useAuthFetcherGet();
  const { data, error, isLoading } = useSWR(`/vaults/${vaultId}/accounts/${accountId}`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return <{ data: Account; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}
