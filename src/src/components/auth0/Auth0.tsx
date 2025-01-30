import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLogoutOptions } from "../../lib/utils/path";
import { Watermark } from "../watermark/Watermark";
import { Dispatch, RootState } from "../../store";
import { useLocation, usePrevious } from "react-use";

import { useNavigate } from "react-router-dom";
import { isOnboarding } from "../../lib/utils/user";
import { OnboardingStage } from "../../../types/types";
import { useTokenSilently } from "../../hooks/useTokenSilently";

const skipRedirects = ["/logout", "/login"];

const Err = {
  EMAIL_NOT_VERIFIED: "email_not_verified",
};

export const Auth0 = (props: Props) => {
  const { children } = props;
  const { loginWithRedirect, isAuthenticated, isLoading, error, logout, user } = useAuth0();
  const getAccessTokenSilently = useTokenSilently();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const errDesc = queryParams.get("error_description");

  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const currentUser = useSelector((state: RootState) => state.user);
  const prevAuth = usePrevious(isAuthenticated);
  const { loading } = useSelector((rootState: RootState) => rootState.loading.models.user);

  const onboardingLoading = isOnboarding(user) && loading;

  // populate current user from db into the redux store
  useEffect(() => {
    if (isAuthenticated && !prevAuth) {
      const fetchUser = async () => {
        const token = await getAccessTokenSilently();
        await dispatch.user.fetchCurrentUser(token);
      };
      fetchUser();
    }
    if (!isAuthenticated) {
      // clear user
      dispatch.user.set();
    }
  }, [isAuthenticated, prevAuth]);

  // redirect to onboarding if needed
  useEffect(() => {
    if (!currentUser) {
      return;
    }
    if (currentUser.user.onboardingStage === OnboardingStage.PROFILE) {
      navigate("/onboarding/profile", { replace: true });
    }
    if (currentUser.user.onboardingStage === OnboardingStage.TENANT_SETUP) {
      navigate("/onboarding/org", { replace: true });
    }
  }, [currentUser]);

  useEffect(() => {
    if (error) {
      logout(getLogoutOptions());
      return;
    }
    if (isLoading || isAuthenticated) {
      return;
    }
    const redirectUrl = skipRedirects.includes(window.location.pathname)
      ? "/"
      : window.location.pathname + window.location.search;
    loginWithRedirect({ appState: { targetUrl: redirectUrl } }).catch((err) => console.error("login redirect", err));
  }, [isLoading, isAuthenticated, error]);

  if (isLoading || onboardingLoading) {
    return <Watermark text="Loading..." />;
  }
  if (error && errDesc !== Err.EMAIL_NOT_VERIFIED) {
    return <Watermark text="Error..." />;
  }
  if (!isAuthenticated) {
    return <Watermark text="Login..." />;
  }
  return <>{children}</>;
};

type Props = {
  children: React.ReactNode;
};
