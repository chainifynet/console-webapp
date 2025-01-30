import { useNavigate } from "react-router-dom";
import { GasStation } from "../../../types/types";
import { Amount } from "../../components/coin/Amount";
import { CoinIcon } from "../../components/coin/CoinIcon";
import { fromNativeParsed, toUSD } from "../../lib/utils/coin";

export const GasStationListItem = (props: Props) => {
  const { gasStation, prices } = props;

  const navigate = useNavigate();

  const link = `/gasstations/${gasStation.assetId}`;

  return (
    <tr className="hover">
      <td className="cursor-pointer" onClick={() => navigate(link)}>
        <div className="flex items-center space-x-3">
          <CoinIcon assetId={gasStation.assetId} />
          <div>
            <div>{gasStation.assetId} Gas Station</div>
          </div>
        </div>
      </td>
      <td className="font-mono text-sm font-light">{gasStation.address}</td>
      <td className="text-right">
        <Amount
          amount={fromNativeParsed(gasStation.balance, gasStation.assetId)}
          asset={gasStation.assetId}
          formattedFiatAmount={toUSD(gasStation.balance, gasStation.assetId, prices)}
        />
      </td>
    </tr>
  );
};
type Props = {
  gasStation: GasStation;
  prices: Record<string, number>;
};
