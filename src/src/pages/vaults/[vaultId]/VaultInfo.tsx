import { useAuth0 } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Vault } from "../../../../types/types";
import { icons } from "../../../constants";
import { useVault } from "../../../hooks/api";
import { Scope, hasScope } from "../../../lib/utils/user";
import { Dispatch } from "../../../store";

const VaultInfo: React.FC = () => {
  const { vaultId } = useParams<{ vaultId: string }>();
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const { user } = useAuth0();

  const { data, isLoading, error } = useVault(vaultId);
  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <VaultSkelleton />;
  }
  if (error) {
    return <p>Could not load vault</p>;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold flex items-center">
          <Icon icon={icons.vault} className="mr-2" />
          <span>{data.name}</span>
        </h1>
        <div className="tooltip tooltip-bottom" data-tip={`Created ${moment(data.createdAt).fromNow()}`}>
          <div className="text-sm opacity-50">{moment(data.createdAt).format("lll")}</div>
        </div>
      </div>

      <div className="w-fit flex flex-col space-y-2">
        <StatusBadge vault={data} />
        <div className="flex items-center space-x-2">
          <div></div>
        </div>
      </div>
      {hasScope(Scope.WriteAccounts, user) && (
        <div className="flex mt-4 justify-between">
          <button
            className={classNames("btn", { "btn-disabled": data?.status !== "COMPLETED" })}
            onClick={() => navigate("#createaccount")}
          >
            Create Account
          </button>
        </div>
      )}
    </div>
  );
};

export default VaultInfo;

// ================================================
/** status badge */
function StatusBadge(props: { vault: Vault }) {
  const { vault } = props;
  let stateClass = "text-warning";
  if ("COMPLETED" === vault.status) {
    stateClass = "text-success";
  } else if (vault.status.includes("FAIL")) {
    stateClass = "text-error";
  }
  return <div className={`badge badge-outline text-xs ${stateClass}`}>{vault.status}</div>;
}

// ================================================
/** Loading skeleton */
const itemStyle = "bg-base-content bg-opacity-10 rounded-full animate-pulse";

function VaultSkelleton() {
  return (
    <div className="w-full flex mb-">
      {/* Column 1  */}
      <div className="w-1/3 mr-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-8 h-8 ${itemStyle}`}></div>
          <div className="w-full">
            <div className={`w-3/4 h-4 mb-2 ${itemStyle}`}></div>
            <div className={`w-1/2 h-4 ${itemStyle}`}></div>
          </div>
        </div>
        <div className={`w-3/4 h-4 mb-2 ${itemStyle}`}></div>
      </div>
    </div>
  );
}
