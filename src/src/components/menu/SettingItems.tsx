import { useAuth0 } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { Scope, hasAnyOfScopes, hasScope } from "../../lib/utils/user";
import { MenuItem } from "./MenuItem";

const iconWidth = 24;

export const SettingItems = () => {
  const { user } = useAuth0();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <div className="w-80 bg-base-200">
      <div className="bg-base-200 sticky top-0 z-10 grid grid-row-2 gap-y-2 bg-opacity-90 py-3 px-2 backdrop-blur">
        <div className="flex w-full px-4">
          <div className="flex items-center">
            <button className="btn mr-4" onClick={() => navigate("/")}>
              <Icon icon="ph:arrow-left-bold" width={iconWidth} />
            </button>
            <h1 className="text-lg font-large">Settings</h1>
          </div>
        </div>
      </div>
      <ul className="menu menu-compact flex flex-col p-0 px-4">
        <li className="menu-title">
          <span>Personal Settings</span>
        </li>
        <li>
          <MenuItem path="/settings/profile" label="Profile settings" icon="ph:user-bold" />
        </li>
      </ul>
      {hasAnyOfScopes([Scope.ReadOrgUsers, Scope.ReadSubscription, Scope.ReadOrgApiKey], user) && (
        <ul className="menu menu-compact flex flex-col p-0 px-4">
          <li />
          <li className="menu-title">
            <span>Tenant Settings</span>
          </li>
          {hasScope(Scope.ReadOrgUsers, user) && (
            <li>
              <MenuItem path="/settings/users" label="Users and Invites" icon="ph:users-bold" />
            </li>
          )}
          {hasScope(Scope.ReadOrgApiKey, user) && (
            <li>
              <MenuItem
                path="/settings/apikeys"
                label="API Keys"
                icon="eos-icons:api-outlined"
                active={getActive(pathname) === "apikeys"}
              />
            </li>
          )}
          {/* {hasScope(Scope.ReadOrgApiKey, user) && ( // TODO add scope for this
            <li>
              <MenuItem path="/settings/integrations" label="Integrations" icon="ph:gear-bold" />
            </li>
          )} */}
          {hasScope(Scope.ReadSubscription, user) && (
            <li>
              <MenuItem
                path="/settings/subscription"
                label="Subscription"
                icon="material-symbols:card-membership-outline-rounded"
              />
            </li>
          )}

          {/* <li>
          <MenuItem path="/settings/policies" label="Permissions and Policies" icon="ph:shield-check-bold" />
        </li> */}
        </ul>
      )}
    </div>
  );
};

function getActive(pathname: string): ItemName | undefined {
  if (match(["/settings/apikeys", "/settings/apikeys/*"], pathname)) {
    return "apikeys";
  }
  return undefined;
}

function match(patterns: string[], pathname: string) {
  return patterns.some((pattern) => matchPath(pattern, pathname));
}

type ItemName = "apikeys";
