import { apiUrl } from "../../constants";
import { useTokenSilently } from "../useTokenSilently";

const getAuthFetcher =
  (getAccessTokenSilently: () => Promise<string>, responseMapper?: (p: any) => Promise<any>) => async (url: string) => {
    const token = await getAccessTokenSilently();
    const response = await fetch(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const res = await response.json();
    if (responseMapper) {
      return responseMapper(res);
    }
    return res;
  };

export const postFetcherFn =
  (tokenGetter: () => Promise<string>) =>
  async ([url, body]: [string, any]) => {
    const token = await tokenGetter();
    const response = await fetch(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  };

/**
 * Gets the Auth0 token and feches the data from API
 */
export const useAuthFetcherGet = (responseMapper?: any) => {
  const getAccessTokenSilently = useTokenSilently();
  return getAuthFetcher(getAccessTokenSilently, responseMapper);
};
