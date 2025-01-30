import { useEffect } from "react";
import { Dispatch, RootState } from "../../store";
import { useGasStations } from "../../hooks/fetch/useGasStations";
import { useDispatch, useSelector } from "react-redux";
import { Watermark } from "../../components/watermark/Watermark";
import { WalletListItemSkeleton } from "../wallets/WalletListItem";
import { GasStationListItem } from "./GasStationListItem";

const loadingSkeletonItems = Array.from({ length: 6 });

const GasStationList: React.FC = () => {
  const { data, isLoading, error } = useGasStations();

  const prices = useSelector((state: RootState) => state.prices);
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (error) {
    return <Watermark text="Gas station List could not be loaded" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!data?.gasStations.length) {
    return <Watermark text="No gas stations" />;
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="table w-full [&_tr.hover:hover_*]:!bg-base-200">
          <thead>
            <tr>
              <th>Gas Station</th>
              <th>Address</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {/* show only current page */}
            {data?.gasStations.map((gasStation, i) => (
              <GasStationListItem gasStation={gasStation} prices={prices} key={gasStation.assetId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GasStationList;

function Loading() {
  return (
    <div className="container mt-10">
      {loadingSkeletonItems.map((_, i) => (
        <WalletListItemSkeleton key={i} />
      ))}
    </div>
  );
}
