import { useMemo } from "react";
import { useSelector } from "react-redux";
import { matchPath, useLocation } from "react-router-dom";
import { OrgPlan } from "../../../types/types";
import {
  icons
} from "../../constants";
import { RootState } from "../../store";
import { Logo } from "./Logo";
import { MenuItem } from "./MenuItem";
import { Search } from "./Search";
import { Scope, hasScope } from "../../lib/utils/user";
import { useAuth0 } from "@auth0/auth0-react";

export const MainItems = () => {
  const { pathname } = useLocation();
  const { user: currentUser } = useAuth0();
  const user = useSelector((state: RootState) => state.user);
  const planId = user?.orgSubscription?.planId;
  const active = useMemo(() => getActive(pathname, []), [pathname]);

  return (
    <div className="w-80 bg-base-200 flex flex-col">
      <div className="bg-base-200 sticky top-0 z-10 grid grid-row-2 gap-y-2 bg-opacity-90 py-3 px-2 backdrop-blur">
        <div className="flex w-full">
          <Logo />
          <Search hideOnLargeScreen />
        </div>
      </div>
      <ul className="menu menu-compact flex flex-col p-0 px-4">
        <li>
          <MenuItem path="/vaults" label="Vaults" icon={icons.vault} active={active === "vaults"} />
        </li>
        {/* <li>
          <MenuItem path="/accounts" label="Accounts" icon="ph:identification-card-bold" />
        </li> */}
        <li>
          <MenuItem path="/wallets" label="Wallets" icon={icons.wallet} active={active === "wallets"} />
        </li>
      </ul>
      <ul className="menu menu-compact flex flex-col p-0 px-4">
        <li />
        <li>
          <MenuItem
            path="/gasstations"
            label="Gas Stations"
            icon={icons.gasstation}
            active={active === "gasstations"}
          />
        </li>
      </ul>
      <ul className="menu menu-compact flex flex-col p-0 px-4 mt-auto mb-5 space-y-2">
        {planId === OrgPlan.DEVELOPER && hasScope(Scope.ReadSubscription, currentUser) && (
          <li className="border-success text-success rounded-lg" style={{ borderWidth: "1px" }}>
            <MenuItem path="/settings/subscription" label="Upgrade" className="justify-center" />
          </li>
        )}

        <li>
          <MenuItem path="/settings/profile" label="Settings" icon="ph:gear-bold" />
        </li>
      </ul>
    </div>
  );
};

function getActive(pathname: string, quicklinks: { path: string }[]): ItemName | undefined {
  if (match(["/vaults", "/vaults/:vaultId", "/vaults/:vaultId/accounts/:accountId"], pathname)) {
    return "vaults";
  }
  if (match(["/gasstations", "/gasstations/*"], pathname)) {
    return "gasstations";
  }
  if (match(["/", "/wallets", "/vaults/:vaultId/wallets/:walletId"], pathname)) {
    // avoid matching the quicklinks
    if (quicklinks.some((item) => item.path === pathname)) return undefined;
    return "wallets";
  }
  return undefined;
}

function match(patterns: string[], pathname: string) {
  return patterns.some((pattern) => matchPath(pattern, pathname));
}

type ItemName = "vaults" | "wallets" | "gasstations";
