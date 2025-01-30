import { GetTokenSilentlyOptions, useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { Dispatch } from "../store";

/**
 * Same as `getAccessTokenSilently` handling the current org selected
 */
export function useTokenSilently() {
  const { getAccessTokenSilently, user } = useAuth0();
  const dispatch = useDispatch<Dispatch>();
  const currentOrg = user?.["https://auth.chainify.net/orgId"];

  return async (opts?: GetTokenSilentlyOptions) => {
    const storedOrgId = localStorage.getItem(`orgId@@${user?.email}`);
    if (!user?.email || !storedOrgId || storedOrgId === currentOrg) {
      return getAccessTokenSilently(opts);
    }

    const token = await getAccessTokenSilently({
      ...opts,
      cacheMode: "off",
      authorizationParams: {
        switchOrgId: storedOrgId,
      },
    });
    await dispatch.user.fetchCurrentUser(token);
    return token;
  };
}
