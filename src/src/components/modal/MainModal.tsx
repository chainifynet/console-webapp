import { User, useAuth0 } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDelayed } from "../../hooks/useDelayed";
import { Scope, hasScope } from "../../lib/utils/user";
import CreateAccount from "./CreateAccount";
import CreateVault from "./CreateVault";
import CreateWallet from "./CreateWallet";
import GasAddress from "./GasAddress";
import InviteUser from "./InviteUser";
import Receive from "./Receive";
import Report from "./Report";
import UpdateUser from "./UpdateUser";
import Send from "./send/Send";
import CreateApiKey from "./apikey/CreateApiKey";
import UpdateApiKey from "./apikey/UpdateApiKey";

const enum Panel {
  RECEIVE = "RECEIVE",
  SEND = "SEND",
  REPORT = "REPORT",
  CREATE_VAULT = "CREATE_VAULT",
  CREATE_ACCOUNT = "CREATE_ACCOUNT",
  CREATE_WALLET = "CREATE_WALLET",
  GAS_ADDRESS = "GAS_ADDRESS",
  INVITE_USER = "INVITE_USER",
  UPDATE_USER = "UPDATE_USER",
  CREATE_APIKEY = "CREATE_APIKEY",
  UPDATE_APIKEY = "UPDATE_APIKEY",
}

const MainModal = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { vaultId, accountId, walletId, assetId, userId, apiKeyId } = useParams();
  const { user } = useAuth0();

  const panel = useMemo(
    () => getPanel({ hash, vaultId, accountId, walletId, assetId, userId, apiKeyId }),
    [hash, vaultId, accountId, walletId, assetId, userId, apiKeyId]
  );
  // to prevent the content from disappearing when the modal is closing
  const delayedPanel = useDelayed(panel);
  return (
    <div
      className={classNames("modal", { "modal-open": Boolean(panel) })}
      onClick={() => {
        if (userId) {
          // hack for update user
          navigate(`/settings/users`, { replace: true });
          return;
        }
        if (apiKeyId) {
          // hack for upadate apikey
          navigate(`/settings/apikeys`, { replace: true });
          return;
        }
        navigate("#", { replace: true });
      }}
    >
      <div
        className="modal-box max-w-xl"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <PanelContent panel={delayedPanel} user={user} />
      </div>
    </div>
  );
};

export default MainModal;

function PanelContent(props: { panel?: PanelInput; user?: User } = {}) {
  const { panel, user } = props;
  if (!panel) {
    return <div></div>;
  }
  const { type, vaultId, accountId, walletId, assetId, apiKeyId } = panel;

  if (type === Panel.RECEIVE && vaultId && walletId) {
    return <Receive vaultId={vaultId} walletId={walletId} />;
  }
  if (type === Panel.SEND && vaultId && walletId) {
    if (!hasScope(Scope.WriteTransactions, user))
      return <NoPermission text="You don't have permission to send funds" />;
    return <Send vaultId={vaultId} walletId={walletId} />;
  }
  if (type === Panel.REPORT && vaultId && walletId) {
    if (!hasScope(Scope.ReadReports, user)) return <NoPermission text="You don't have permission for this action" />;
    return <Report vaultId={vaultId} walletId={walletId} />;
  }
  if (type === Panel.CREATE_VAULT) {
    if (!hasScope(Scope.WriteVaults, user)) return <NoPermission text="You don't have permission for this action" />;
    return <CreateVault />;
  }
  if (type === Panel.CREATE_ACCOUNT && vaultId) {
    if (!hasScope(Scope.WriteAccounts, user)) return <NoPermission text="You don't have permission for this action" />;
    return <CreateAccount vaultId={vaultId} />;
  }
  if (type === Panel.CREATE_WALLET && vaultId && accountId) {
    if (!hasScope(Scope.WriteWallets, user)) return <NoPermission text="You don't have permission for this action" />;
    return <CreateWallet vaultId={vaultId} accountId={accountId} />;
  }
  if (type === Panel.GAS_ADDRESS && assetId) {
    return <GasAddress assetId={assetId} />;
  }
  if (type === Panel.INVITE_USER) {
    if (!hasScope(Scope.CreateOrgUserInvite, user))
      return <NoPermission text="You don't have permission for this action" />;
    return <InviteUser />;
  }
  if (type === Panel.UPDATE_USER) {
    if (!hasScope(Scope.UpdateOrgUsers, user)) return <NoPermission text="You don't have permission for this action" />;
    return <UpdateUser />;
  }
  if (type === Panel.CREATE_APIKEY) {
    if (!hasScope(Scope.WriteOrgApiKey, user)) return <NoPermission text="You don't have permission for this action" />;
    return <CreateApiKey />;
  }
  if (type === Panel.UPDATE_APIKEY && apiKeyId) {
    if (!hasScope(Scope.WriteOrgApiKey, user)) return <NoPermission text="You don't have permission for this action" />;
    return <UpdateApiKey apiKeyId={apiKeyId} />;
  }
  return <div></div>;
}

function NoPermission({ text }: { text?: string }) {
  return (
    <div className="alert alert-error shadow-lg justify-center mt-6">
      <div>
        <Icon icon="ph:x-circle-bold" />
        <span>{text}</span>
      </div>
    </div>
  );
}

function getPanel({
  hash,
  vaultId,
  accountId,
  walletId,
  assetId,
  userId,
  apiKeyId,
}: {
  hash?: string;
  vaultId?: string;
  accountId?: string;
  walletId?: string;
  assetId?: string;
  userId?: string;
  apiKeyId?: string;
}): PanelInput | undefined {
  if (hash === "#createvault") {
    return { type: Panel.CREATE_VAULT };
  }
  if (hash === "#createaccount" && vaultId) {
    return { type: Panel.CREATE_ACCOUNT, vaultId };
  }
  if (hash === "#createwallet" && vaultId && accountId) {
    return { type: Panel.CREATE_WALLET, vaultId, accountId };
  }
  if (hash === "#receive" && vaultId && walletId) {
    return { type: Panel.RECEIVE, vaultId, walletId };
  }
  if (hash === "#report" && vaultId && walletId) {
    return { type: Panel.REPORT, vaultId, walletId };
  }
  if (hash === "#gasaddress" && assetId) {
    return { type: Panel.GAS_ADDRESS, assetId };
  }
  if (hash === "#send" && vaultId && walletId) {
    return { type: Panel.SEND, vaultId, walletId };
  }
  if (hash === "#invite") {
    return { type: Panel.INVITE_USER };
  }
  if (hash === "#update" && userId) {
    return { type: Panel.UPDATE_USER, userId };
  }
  if (hash === "#createapikey") {
    return { type: Panel.CREATE_APIKEY };
  }
  if (hash === "#update" && apiKeyId) {
    return { type: Panel.UPDATE_APIKEY, apiKeyId };
  }
  return undefined;
}

type PanelInput = {
  type: Panel;
  vaultId?: string;
  accountId?: string;
  walletId?: string;
  assetId?: string;
  userId?: string;
  apiKeyId?: string;
};
