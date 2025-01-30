import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { CoinIcon } from "../../../components/coin/CoinIcon";
import { icons } from "../../../constants";
import { useGasStation } from "../../../hooks/fetch/useGasStation";
import { fromNativeParsed, toUSD } from "../../../lib/utils/coin";
import { Dispatch, RootState } from "../../../store";

const breadCrumbs = [
  {
    label: "Gas Stations",
    link: "/gasstations",
  },
];

export const GasStationInfo: React.FC = () => {
  const { assetId } = useParams();
  const { data, isLoading, error } = useGasStation(assetId || "");
  const prices = useSelector((state: RootState) => state.prices);
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <GasStationSkelleton />;
  }
  if (error) {
    return <p>Could not load gas station</p>;
  }
  return (
    <div>
      <BreadCrumbs items={breadCrumbs} />
      <h1 className="text-xl font-bold flex items-center mb-4">
        <Icon icon={icons.gasstation} className="mr-2" />
        <span>Gas Station</span>
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
        <button className="btn" onClick={() => navigate("#gasaddress")}>
          Receive
        </button>
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

export const GasStationSkelleton = () => {
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
