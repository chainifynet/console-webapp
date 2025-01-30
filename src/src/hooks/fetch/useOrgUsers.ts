import useSWRInfinite from "swr/infinite";
import { OrgUserResponse } from "../../../types/types";
import { useAuthFetcherGet } from "./common";

const getKey = () => (pageIndex: number, previousPageData: Data) => {
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) {
    return `/orgs/users`;
  }
  // reached the end
  if (!previousPageData?.last) {
    return null;
  }
  // add the cursor to the API endpoint
  return `/orgs/users?last=${previousPageData.last}`;
};

/**
 * Will fetch org users
 */
export function useOrgUsers() {
  const fetcher = useAuthFetcherGet((res: any) => res?.data);
  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey(), fetcher, {
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

type Data = {
  users: OrgUserResponse[];
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
