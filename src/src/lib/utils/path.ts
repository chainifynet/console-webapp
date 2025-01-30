import { type LogoutOptions } from "@auth0/auth0-react";

export function getLogoutOptions(): LogoutOptions {
  return {
    logoutParams: {
      returnTo: window.location.origin + "/logout" + window.location.search,
    },
  };
}
