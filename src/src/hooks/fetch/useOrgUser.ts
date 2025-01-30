import useSWR from "swr";
import { OrgUserResponse } from "../../../types/types";
import { useAuthFetcherGet } from "./common";

export function useOrgUser(userId: string) {
  const fetcher = useAuthFetcherGet((res: any) => res?.data?.user);
  const { data, error, isLoading } = useSWR(userId ? `/orgs/users/${userId}` : null, fetcher, {
    shouldRetryOnError: false,
  });

  return <{ data: OrgUserResponse; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}
