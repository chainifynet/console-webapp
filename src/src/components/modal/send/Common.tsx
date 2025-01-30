import classNames from "classnames";
import { FeeEstimate } from "../../../hooks/fetch/useFeeEstimate";
import { Asset, AssetType, fromNativeParsed, toUSD } from "../../../lib/utils/coin";

export function FeeAndRemaining(props: FeeAndRemainingProps) {
  const { asset, fee, prices, remaining, dim = false } = props;
  return (
    <div>
      <div className="flex justify-between text-sm px-1">
        <label className="font-bold opacity-60">
          <div>Estimated Miner Fee</div>
          {asset.assetType !== AssetType.NATIVE && <div className="text-xs font-normal">Payable in native asset</div>}
        </label>
        <div className={classNames("text-end", { "opacity-60": dim })}>
          <div>
            <span>{fromNativeParsed(fee?.amount, asset.nativeAsset)} </span>
            <span className="text-xs">{asset.nativeAsset}</span>
          </div>
          <div>
            <span>{toUSD(fee?.amount, asset.nativeAsset, prices)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4" />
      <div className="flex justify-between text-sm px-1">
        <label className="font-bold opacity-60">Aprox. Remaining Balance</label>
        <div className={classNames("text-end", { "opacity-60": dim })}>
          <div>
            <span className="font-bold">{fromNativeParsed(remaining, asset.assetId)} </span>
            <span className="text-xs">{asset.assetId}</span>
          </div>
          <div>
            <span className="font-bold">{toUSD(remaining, asset.assetId, prices)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface FeeAndRemainingProps {
  asset: Asset;
  fee: FeeEstimate;
  prices: Record<string, number>;
  remaining?: string;
  dim?: boolean;
}
