import { Tx, TxType, type Wallet } from "../../../../../../types/types";
import { Asset, explorerTxUrl, fromNativeParsed, getAssetSafe, toUSD } from "../../../../../lib/utils/coin";
import moment from "moment";
import { Amount } from "../../../../../components/coin/Amount";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MiddleEllipsis } from "../../../../../components/MiddleEllipsis";
import classNames from "classnames";

export const TxListItem = (props: Props) => {
  const { tx, prices } = props;

  const navigate = useNavigate();

  // TODO
  const link = `/vaults/${tx.vaultId}/wallets/${tx.walletId}`;

  const asset = getAssetSafe(tx.assetId) as Asset;
  const isFailed = tx.status.startsWith("FAILED");

  return (
    <tr className={classNames({ "opacity-60": isFailed })}>
      {/* <td className="cursor-pointer" onClick={() => navigate(link)}> */}
      <td>
        <div className="flex items-center space-x-3">
          <DirectionIcon tx={tx} />
          <div>
            {tx.txHash && (
              <div className="flex items-center space-x-1">
                <MiddleEllipsis text={tx.txHash} />
                <a href={explorerTxUrl(tx.assetId, tx.txHash)} target="_blank" rel="noopener noreferrer">
                  <Icon icon="ph:arrow-square-out-bold" />
                </a>
              </div>
            )}
            <div className="tooltip" data-tip={`Created ${moment(tx.createdAt).fromNow()}`}>
              <div className="text-sm opacity-50">{moment(tx.createdAt).format("lll")}</div>
            </div>
          </div>
        </div>
      </td>
      <td>
        <FromTo tx={tx} />
      </td>

      <td className="font-light text-center opacity-80">
        <StatusBadge tx={tx} />
      </td>
      <td className="text-xs font-light text-center">{tx.type}</td>
      <td className="text-sm font-light text-right">
        <div>{fromNativeParsed(tx.minerFee, asset.nativeAsset)}</div>
        <div>{toUSD(tx.minerFee, asset.nativeAsset, prices)}</div>
      </td>
      <td className="text-right">
        <Amount
          amount={fromNativeParsed(tx.amount, tx.assetId)}
          asset={tx.assetId}
          formattedFiatAmount={toUSD(tx.amount, tx.assetId, prices)}
          direction={tx.direction}
        />
      </td>
    </tr>
  );
};
type Props = {
  tx: Tx;
  prices: Record<string, number>;
};

const iconSize = 18;

// ================================================
/** In/out icon */
function DirectionIcon(props: { tx: Tx }) {
  const { tx } = props;
  if (tx.direction === "IN") {
    return <Icon icon="ph:arrow-line-down-bold" className="text-success" fontSize={iconSize} />;
  } else if (tx.type === TxType.FEE_FOR_TOKEN_SEND) {
    return <Icon icon="ph:coins-bold" className="text-error" fontSize={iconSize} />;
  } else {
    return <Icon icon="ph:arrow-line-up-bold" className="text-error" fontSize={iconSize} />;
  }
}

// ================================================
/** From or To */
function FromTo(props: { tx: Tx }) {
  const { tx } = props;
  const label = tx.direction === "IN" ? "From:" : "To:";
  const value = tx.direction === "IN" ? tx.from : tx.to;

  if (tx.type === TxType.FEE_FOR_TOKEN_SEND) {
    const [, token] = tx.to.split("##");
    const tokenAsset = getAssetSafe(token) as Asset;
    return (
      <div className=" ">
        Fee To Transact <span className="font-semibold">{tokenAsset.symbol}</span>
      </div>
    );
  }

  return (
    <div className="text-sm font-light space-y-1">
      <div className="opacity-40 font-bold menu-title select-none">{label}</div>
      <div className="font-mono">{value}</div>
    </div>
  );
}

// ================================================
/** status badge */
function StatusBadge(props: { tx: Tx }) {
  const { tx } = props;
  if (["COMPLETE"].includes(tx.status)) {
    // could include CONFIRMED but in eth it is quite fast
    return <div className="badge badge-outline text-success text-xs">{tx.status}</div>;
  } else if (tx.status.startsWith("FAILED")) {
    return <div className="badge badge-outline text-error text-xs">{tx.status}</div>;
  } else {
    return <div className="badge badge-outline text-warning text-xs">{tx.status}</div>;
  }
}

// ================================================
/** Loading skeleton */
const itemStyle = "bg-base-content bg-opacity-10 rounded-full animate-pulse";

export const TxListItemSkeleton = () => {
  return (
    <div className="w-full flex mb-10">
      {/* Column 1  */}
      <div className="w-2/6 mr-10">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${itemStyle}`}></div>
          <div className="w-full">
            <div className={`w-3/4 h-4 mb-2 ${itemStyle}`}></div>
            <div className={`w-1/2 h-4 ${itemStyle}`}></div>
          </div>
        </div>
      </div>

      {/* <!-- Column 2 --> */}
      <div className="w-1/6 mr-10">
        <div className={`h-4 mb-2 ${itemStyle}`}></div>
        <div className={`h-4 ${itemStyle}`}></div>
      </div>

      {/* <!-- Column 3 --> */}
      <div className="w-1/6 mr-10">
        <div className={`h-4 ${itemStyle}`}></div>
      </div>

      {/* <!-- Column 4 --> */}
      <div className="w-1/6">
        <div className={`h-4 mb-2 ${itemStyle}`}></div>
        <div className={`h-4 ${itemStyle}`}></div>
      </div>
    </div>
  );
};
