import { Icon } from "@iconify/react";
import { getAsset } from "../../lib/utils/coin";

export const CoinIcon = (props: Props) => {
  const { assetId, size = 34 } = props;
  const asset = getAsset(assetId);
  const nativeAsset = getAsset(asset.nativeAsset);
  return (
    <div className="relative inline-flex text-sm font-medium text-center mr-3">
      <Icon icon={asset.icon} width={size} />
      {assetId !== nativeAsset.assetId && (
        <div
          style={{ width: 20, borderWidth: "1.2px", borderStyle: "solid", bottom: "-0.55rem", right: "-0.55rem" }}
          className="absolute items-center justify-center rounded-full border-base-100"
        >
          <Icon icon={nativeAsset.icon} className="w-full h-full rounded-full " />
        </div>
      )}
    </div>
  );
};

type Props = {
  assetId: string;
  size?: number;
};
