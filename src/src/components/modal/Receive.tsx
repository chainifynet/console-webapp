import { Asset, AssetType, explorerAddressUrl, getAssetSafe } from "../../lib/utils/coin";
import QRCode from "qrcode.react";
import { Icon } from "@iconify/react";
import { CoinIcon } from "../coin/CoinIcon";
import { useWallet } from "../../hooks/api";
import { Watermark } from "../watermark/Watermark";
import CopyTextField from "../CopyTextField";
import { icons } from "../../constants";

interface ReceiveProps {
  vaultId: string;
  walletId: string;
}

const Receive = (props: ReceiveProps) => {
  const { vaultId, walletId } = props;
  const { data, isLoading, error } = useWallet(vaultId, walletId);

  if (error) {
    return <Watermark text="Could not retrieve wallet data" />;
  }
  if (isLoading || !data) {
    return <Watermark text="Loading..." />;
  }
  const asset = getAssetSafe(data?.assetId) as Asset;

  return (
    <div className="text-center">
      <CoinIcon assetId={data.assetId} />
      <div className="mt-3"></div>
      <h2 className="text-lg flex justify-center space-x-2 items-center">
        <Icon icon={icons.wallet} />
        <div>{data.name}</div>
      </h2>
      <div className="mt-4"></div>
      {asset.assetType !== AssetType.NATIVE ? (
        <p className="text-sm">
          <strong>{data.assetId}</strong> address on the <strong>{asset.nativeAsset}</strong> network
        </p>
      ) : (
        <p className="text-sm ">
          <strong>{data.assetId}</strong> address
        </p>
      )}
      <div className="mt-4"></div>
      <div className="flex justify-center">
        <QRCode value={data.address} />
      </div>

      <div className="mt-4"></div>
      <CopyTextField value={data.address} />
      <div className="mt-4"></div>
      <a
        className="whitespace-nowrap no-underline inline-flex items-start"
        href={explorerAddressUrl(data.assetId, data.address)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="text-sm">View in explorer</span>
        <span className="ml-1">
          <Icon icon="ph:arrow-square-out-bold" />
        </span>
      </a>
      <div className="mt-4"></div>
    </div>
  );
};

export default Receive;
