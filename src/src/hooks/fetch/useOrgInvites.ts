import useSWR from "swr";
import { useAuthFetcherGet } from "./common";
import { OrgRoleGroup } from "../../../types/types";

export function useOrgInvites() {
  const fetcher = useAuthFetcherGet((res: any) => res?.data?.invites);
  const { data, error, isLoading } = useSWR(`/users/orgs/invites`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return <{ data: Invite[]; isLoading: boolean; error: any }>{
    data,
    isLoading,
    error,
  };
}

export interface Invite {
  userId: string;
  orgId: string;
  tenant: string;
  orgRoles: OrgRoleGroup[];
  invitedAt: string;
}
