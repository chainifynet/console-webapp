import { useAuth0 } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { icons } from "../../../../../constants";
import { useAccount } from "../../../../../hooks/fetch/useAccount";
import { Scope, hasScope } from "../../../../../lib/utils/user";
import { Dispatch } from "../../../../../store";

interface Props {
  vaultId: string;
  accountId: string;
}

const AccountInfo: React.FC<Props> = ({ vaultId, accountId }) => {
  const { data, isLoading, error } = useAccount(vaultId, accountId);
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const { user } = useAuth0();

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <AccountSkelleton />;
  }
  if (error) {
    return <p>Could not load account</p>;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold flex items-center">
          <Icon icon={icons.account} className="mr-2" />
          <span>{data.name}</span>
        </h1>
        <div className="tooltip tooltip-bottom" data-tip={`Created ${moment(data.createdAt).fromNow()}`}>
          <div className="text-sm opacity-50">{moment(data.createdAt).format("lll")}</div>
        </div>
      </div>

      {hasScope(Scope.WriteWallets, user) && (
        <div className="flex mt-4 justify-between">
          <button className="btn" onClick={() => navigate("#createwallet")}>
            Create Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;

// ================================================
/** Loading skeleton */
const itemStyle = "bg-base-content bg-opacity-10 rounded-full animate-pulse";

function AccountSkelleton() {
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
