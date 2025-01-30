import { Icon } from "@iconify/react";
import Big from "big.js";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Wallet } from "../../../../types/types";
import { icons } from "../../../constants";
import { useWallet } from "../../../hooks/api";
import { FeeEstimate, useFeeEstimate } from "../../../hooks/fetch/useFeeEstimate";
import { Asset, AssetType, getAssetSafe, inputToUSD, toNative, validateAddress } from "../../../lib/utils/coin";
import { RootState } from "../../../store";
import { CoinIcon } from "../../coin/CoinIcon";
import { Watermark } from "../../watermark/Watermark";
import { FeeAndRemaining } from "./Common";
import SendConfirm from "./SendConfirm";

interface Props {
  vaultId: string;
  walletId: string;
}

interface FormData {
  address: string;
  amount: string;
  note?: string;
}

const Send: React.FC<Props> = (props) => {
  const { vaultId, walletId } = props;
  const prices = useSelector((state: RootState) => state.prices);
  const { data: wallet, isLoading: walletLoading, error: walletErr } = useWallet(vaultId, walletId);
  const { data: fee, isLoading: feeLoading, error: feeErr } = useFeeEstimate(wallet?.assetId, wallet?.address); // I don't care about the fee error for now
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      address: "",
      amount: "",
      note: "",
    },
  });

  const [completeFormData, setCompleteFormData] = useState<null | FormData>();
  const [remaining, setRemaining] = useState<undefined | string>(wallet?.balance || "0");
  const watchedAmount = watch("amount");

  const asset = getAssetSafe(wallet?.assetId) as Asset;

  const validateAmountFormat = useCallback(
    (value: string) => {
      if (!asset.decimals) return "Missing asset";
      const regex = new RegExp(`^\\d+(\\.\\d{0,${asset?.decimals}})?$`);
      return regex.test(value) || `Should be a number with up to ${asset.decimals} decimal places`;
    },
    [asset?.decimals]
  );

  const validateInputAddress = useCallback(
    (value: string) => {
      if (!asset.decimals) return "Missing asset";
      return validateAddress(value, asset?.assetId) || `Not a valid ${asset.name} address`;
    },
    [asset?.assetId]
  );

  const validateBalance = useCallback(
    (value: string) => {
      const remain = calculateRemaining(value, wallet, fee);
      return remain.gte(0) || "Insufficient funds";
    },
    [wallet?.balance, fee?.amount]
  );

  useEffect(() => {
    const remain = calculateRemaining(watchedAmount, wallet, fee);
    if (remain.lt(0)) {
      setRemaining("0");
    } else {
      setRemaining(remain.toString());
    }
  }, [wallet?.balance, fee?.amount, watchedAmount]);

  const preSend = (data: FormData) => {
    // TODO maybe validate
    setCompleteFormData(data);
  };

  if (walletErr) {
    return <Watermark text="Could not retrieve wallet or fee data" />;
  }
  if (walletLoading || !wallet) {
    return <Watermark text="Loading..." />;
  }

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  if (completeFormData) {
    return (
      <div>
        <Heading wallet={wallet} asset={asset} />
        <SendConfirm
          wallet={wallet}
          params={completeFormData}
          fee={fee}
          prices={prices}
          remaining={remaining}
          asset={asset}
          onBackClicked={() => setCompleteFormData(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <Heading wallet={wallet} asset={asset} />
      <form
        className="form-control w-full mt-4 mb-4 flex flex-col "
        onSubmit={handleSubmit((data) => preSend(data))}
        onKeyDown={handleKeyPress}
        autoComplete="off"
      >
        <div>
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input
            {...register("address", { required: "Address is required", validate: validateInputAddress })}
            type="text"
            placeholder={`${asset.name} address`}
            className={classNames("input input-bordered w-full", { "input-error": Boolean(errors?.address?.type) })}
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors.address && <span className="label-text-alt text-error">{errors?.address?.message}</span>}
          </label>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            {...register("amount", {
              required: "Amount is required",
              validate: { validateAmountFormat, validateBalance },
            })}
            type="text"
            placeholder={`Amount of ${asset.assetId}`}
            className={classNames("input input-bordered w-full", { "input-error": Boolean(errors?.amount?.type) })}
          />
          <label className="label">
            <span className="label-text-alt">{inputToUSD(toBig(watchedAmount), wallet?.assetId, prices)}</span>
            {errors.amount && <span className="label-text-alt text-error">{errors?.amount?.message}</span>}
          </label>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Note</span>
          </label>
          <input
            {...register("note")}
            type="text"
            placeholder={`Internal note`}
            className={classNames("input input-bordered w-full", { "input-error": Boolean(errors?.note?.type) })}
          />
        </div>

        <div className="mt-8" />
        <FeeAndRemaining fee={fee} asset={asset} prices={prices} remaining={remaining} />
        <div className="mt-4" />

        {asset.assetType !== AssetType.NATIVE && (
          <div className="list-disc list-inside space-y-2 text-sm opacity-70 mt-8 pl-1 pr-1">
            Miner fees will be paid by the native <span className="font-bold">{asset.nativeAsset}</span> wallet
          </div>
        )}

        <div className="mb-4"></div>
        <div className="modal-action">
          <button type="button" className="btn" onClick={() => navigate("#")}>
            Cancel
          </button>
          <div className="tooltip tooltip-left" data-tip="Will ask for confirmation">
            <button type="submit" className="btn btn-primary">
              Send...
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Send;

function Heading({ wallet, asset }: { wallet: Wallet; asset: Asset }) {
  return (
    <div className="text-center">
      <CoinIcon assetId={wallet.assetId} />
      <h2 className="flex justify-center space-x-2 items-center text-lg my-2">
        <Icon icon={icons.wallet} />
        <div>{wallet.name}</div>
      </h2>
      {asset.assetType === AssetType.NATIVE && (
        <div className="text-sm">
          Will send <span className="font-bold">{wallet.assetId}</span>
        </div>
      )}
      {asset.assetType !== AssetType.NATIVE && (
        <div className="text-sm">
          Will send <span className="font-bold">{wallet.assetId}</span> in the{" "}
          <span className="font-bold">{asset.nativeAsset}</span> network
        </div>
      )}
    </div>
  );
}

function calculateRemaining(inputAmount?: string, wallet?: Wallet, fee?: FeeEstimate) {
  const walletBalance = toBig(wallet?.balance);
  let feeAmount = Big(0);
  if (fee?.assetId === wallet?.assetId) {
    // only subtract fee for native coins
    feeAmount = toBig(fee?.amount);
  }
  const inputAm = wallet ? toNative(toBig(inputAmount).toString(), wallet.assetId) : 0;
  return walletBalance.minus(inputAm).minus(feeAmount);
}

function toBig(value?: string | number) {
  if (!value) {
    return Big(0);
  }
  if (typeof value === "number") {
    value = value.toString();
  }
  const regex = /^\d+(\.\d{0,18})?$/;
  if (regex.test(value)) {
    return Big(value);
  }
  return Big(0);
}
