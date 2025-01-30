import { useAuth0 } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BreadCrumbs from "../../../../../components/BreadCrumbs";
import { CoinIcon } from "../../../../../components/coin/CoinIcon";
import { icons } from "../../../../../constants";
import { useWallet } from "../../../../../hooks/api";
import { fromNativeParsed, toUSD } from "../../../../../lib/utils/coin";
import { Scope, hasScope } from "../../../../../lib/utils/user";
import { Dispatch, RootState } from "../../../../../store";

interface Props {
  vaultId: string;
  walletId: string;
}

export const WalletInfo: React.FC<Props> = ({ vaultId, walletId }) => {
  const { data, isLoading, error } = useWallet(vaultId, walletId);
  const prices = useSelector((state: RootState) => state.prices);
  const { user } = useAuth0();

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const br = useMemo(() => {
    const r = [
      {
        label: "Vaults",
        link: "/vaults",
      },
      {
        label: "Accounts",
        link: `/vaults/${vaultId}`,
      },
    ];
    if (data?.accountId) {
      r.push({
        label: "Wallets",
        link: `/vaults/${vaultId}/accounts/${data.accountId}`,
      });
    }
    return r;
  }, [vaultId, walletId, data?.accountId]);

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <WalletSkelleton />;
  }
  if (error) {
    return <p>Could not load wallet</p>;
  }
  return (
    <div>
      <BreadCrumbs items={br} />
      <h1 className="text-xl font-bold flex items-center mb-4">
        <Icon icon={icons.wallet} className="mr-2" />
        <span>{data.name}</span>
      </h1>
      <div className="w-fit flex flex-col items-end">
        <div className="flex items-center space-x-2">
          <CoinIcon assetId={data.assetId} />
          <div>
            <span className="text-2xl font-bold mr-2">{fromNativeParsed(data.balance, data.assetId)}</span>
            <span>{data.assetId}</span>
          </div>
        </div>
        <div className="text-xl font-bold">{toUSD(data.balance, data.assetId, prices)}</div>
      </div>
      <div className="flex mt-4 justify-between">
        <div className="btn-group ">
          {/* <button className="btn btn-disabled">Send</button> */}
          <button
            className={classNames("btn", { "btn-disabled": !hasScope(Scope.WriteTransactions, user) })}
            onClick={() => navigate("#send")}
          >
            Send
          </button>
          <button className="btn btn-primary" onClick={() => navigate("#receive")}>
            Receive
          </button>
        </div>
        {hasScope(Scope.ReadReports, user) && (
          <div>
            <button className="btn" onClick={() => navigate("#report")}>
              Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

type RouteParams = {
  vaultId: string;
  walletId: string;
};

// ================================================
/** Loading skeleton */
const itemStyle = "bg-base-content bg-opacity-10 rounded-full animate-pulse";

export const WalletSkelleton = () => {
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
};
