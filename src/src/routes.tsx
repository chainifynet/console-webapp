import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Scope } from "./lib/utils/user";
import { NotFound } from "./pages/NotFound";
import { Logout } from "./pages/auth/Logout";
import WithPermission from "./pages/auth/WithPermission";
import GasStationList from "./pages/gasstations/GasStationList";
import { GasStationInfo } from "./pages/gasstations/[assetId]/GasStationInfo";
import { OnboardingComplete } from "./pages/onboarding/OnboardingComplete";
import { OnboardingOrg } from "./pages/onboarding/OnboardingOrg";
import { OnboardingProfile } from "./pages/onboarding/OnboardingProfile";
import Search from "./pages/search/Search";
import { Profile } from "./pages/settings/Profile";
import OrgUsers from "./pages/settings/users/OrgUsers";
import VaultList from "./pages/vaults/VaultList";
import VaultAccounts from "./pages/vaults/[vaultId]/VaultAccounts";
import AccountWallets from "./pages/vaults/[vaultId]/accounts/[accountId]/AccountWallets";
import { WalletTransactions } from "./pages/vaults/[vaultId]/wallets/[walletId]/WalletTransactions";
import { WalletList } from "./pages/wallets/WalletList";
import { Subscription } from "./pages/settings/subscription/Subscription";
import { Integration } from "./pages/settings/integration/Integration";
import { ApiKey } from "./pages/settings/apikey/ApiKey";

export const router = createBrowserRouter([
  {
    path: "/",
    element: withMenu(
      <WithPermission scope={Scope.ReadWallets}>
        <WalletList />
      </WithPermission>
    ), // TODO make a dashboard
  },
  {
    path: "/gasstations",
    element: withMenu(<GasStationList />),
  },
  {
    path: "/gasstations/:assetId",
    element: withMenu(<GasStationInfo />),
  },
  {
    path: "/vaults",
    element: withMenu(<VaultList />),
  },
  {
    path: "/wallets",
    element: withMenu(<WalletList />),
  },
  {
    path: "/vaults/:vaultId",
    element: withMenu(<VaultAccounts />),
  },
  {
    path: "/vaults/:vaultId/accounts",
    element: withMenu(<div>Accounts</div>),
  },
  {
    path: "/vaults/:vaultId/accounts/:accountId",
    element: withMenu(<AccountWallets />),
  },
  {
    path: "/vaults/:vaultId/wallets",
    element: withMenu(<div>Wallets</div>),
  },
  {
    path: "/vaults/:vaultId/wallets/:walletId",
    element: withMenu(<WalletTransactions />),
  },
  // ==============================
  // search
  {
    path: "/search",
    element: withMenu(<Search />),
  },
  // ==============================
  // settings
  {
    path: "/settings",
    element: withMenu(<div>Settings</div>, true),
  },
  {
    path: "/settings/profile",
    element: withMenu(<Profile />, true),
  },
  {
    path: "/settings/subscription",
    element: withMenu(<Subscription />, true),
  },
  {
    path: "/settings/users",
    element: withMenu(<OrgUsers />, true),
  },
  {
    path: "/settings/apikeys",
    element: withMenu(<ApiKey />, true),
  },
  {
    path: "/settings/integrations",
    element: withMenu(<Integration />, true),
  },
  {
    path: "/settings/apikeys/:apiKeyId",
    element: withMenu(<ApiKey />, true),
  },
  {
    path: "/settings/users/:userId",
    element: withMenu(<OrgUsers />, true),
  },
  {
    path: "/settings/policies",
    element: withMenu(<div>Settings</div>, true),
  },
  // onboarding
  {
    path: "/onboarding/profile",
    element: (
      <App showMenu={false}>
        <OnboardingProfile />
      </App>
    ),
  },
  {
    path: "/onboarding/org",
    element: (
      <App showMenu={false}>
        <OnboardingOrg />
      </App>
    ),
  },
  {
    path: "/onboarding/complete",
    element: (
      <App showMenu={false}>
        <OnboardingComplete />
      </App>
    ),
  },
  // auth
  {
    path: "/logout",
    element: <Logout />,
  },
  // 404
  {
    path: "*",
    element: (
      <App showMenu={false}>
        <NotFound />
      </App>
    ),
  },
]);

function withMenu(children: React.ReactNode, showSettings = false) {
  return <App showSettings={showSettings}>{children}</App>;
}
