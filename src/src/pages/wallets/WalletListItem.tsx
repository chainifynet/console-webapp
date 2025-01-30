import { type Wallet } from "../../../types/types";
import { CoinIcon } from "../../components/coin/CoinIcon";
import { fromNativeParsed, toUSD } from "../../lib/utils/coin";
import moment from "moment";
import { Amount } from "../../components/coin/Amount";
import { useNavigate } from "react-router-dom";

export const WalletListItem = (props: Props) => {
  const { wallet, prices } = props;

  const navigate = useNavigate();

  const link = `/vaults/${wallet.vaultId}/wallets/${wallet.walletId}`;

  return (
    <tr className="hover">
      <td className="cursor-pointer" onClick={() => navigate(link)}>
        <div className="flex items-center space-x-3">
          <CoinIcon assetId={wallet.assetId} />
          <div>
            <div>{wallet.name}</div>
            <div className="tooltip" data-tip={`Created ${moment(wallet.createdAt).fromNow()}`}>
              <div className="text-sm opacity-50">{moment(wallet.createdAt).format("lll")}</div>
            </div>
          </div>
        </div>
      </td>
      <td className="font-mono text-sm font-light">{wallet.address}</td>
      <td className="text-right">
        <Amount
          amount={fromNativeParsed(wallet.balance, wallet.assetId)}
          asset={wallet.assetId}
          formattedFiatAmount={toUSD(wallet.balance, wallet.assetId, prices)}
        />
      </td>
    </tr>
  );
};
type Props = {
  wallet: Wallet;
  prices: Record<string, number>;
};

// ================================================
/** Loading skeleton */

const itemStyle = "bg-base-content bg-opacity-10 rounded-full animate-pulse";
export const WalletListItemSkeleton = () => {
  return (
    <div className="w-full flex mb-10">
      {/* Column 1  */}
      <div className="w-3/6 mr-10">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 mb-2 ${itemStyle}`}></div>
          <div className="w-full">
            <div className={`w-3/4 h-4 mb-2 ${itemStyle}`}></div>
            <div className={`w-1/2 h-4 ${itemStyle}`}></div>
          </div>
        </div>
      </div>

      {/* <!-- Column 2 --> */}
      <div className="w-2/6 mr-10">
        <div className={`h-4 mb-2 ${itemStyle}`}></div>
      </div>

      {/* <!-- Column 3 --> */}
      <div className="w-1/6">
        <div className={`h-4 mb-2 ${itemStyle}`}></div>
        <div className={`h-4 ${itemStyle}`}></div>
      </div>
    </div>
  );
};
