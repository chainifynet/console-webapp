import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import { useWallets } from "../../hooks/fetch/useWallets";
import useApi from "../../hooks/useApi";
import { useTokenSilently } from "../../hooks/useTokenSilently";
import * as api from "../../lib/api/api";
import { getCreateWalletAssetList } from "../../lib/utils/coin";
import { Dispatch } from "../../store";

const title = "Create Wallet";

// TODO! - ask the backend to give a list of available options for the specific account or vault:
// 1. if the account (or vault if root) does not have the native wallet setup you cannot create USDT
// 2. if the account (or vault if root) has already a USDT wallet you cannot create another one
const assets = getCreateWalletAssetList();

type Props = {
  vaultId: string;
  accountId: string;
};

type FormData = {
  name: string;
  assetId: string;
};

export default function CreateWallet({ vaultId, accountId }: Props) {
  const navigate = useNavigate();
  const getAccessTokenSilently = useTokenSilently();
  const dispatch = useDispatch<Dispatch>();

  // TODO for now it is ok since we don't have more than 50 assets, then we should create a specific endpoint for this
  const { data, isLoading, error } = useWallets({ accountId });
  const [availableAssets, setAvailableAssets] = useState(assets);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      assetId: availableAssets[0]?.assetId,
    },
  });

  useEffect(() => {
    if (!data?.[0]?.wallets?.length) return;
    const availableAssets = assets.filter((asset) => {
      return !data?.[0]?.wallets.find((wallet) => wallet.assetId === asset.assetId);
    });
    setAvailableAssets(availableAssets);
    reset({
      assetId: availableAssets[0]?.assetId,
    });
  }, [data?.length]);

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  const [doCreateWallet, state] = useApi(async (formData: FormData) => {
    const token = await getAccessTokenSilently();
    return api.createWallet(token, vaultId, accountId, formData.assetId, formData.name).then((res) => {
      mutate(unstable_serialize(() => `/wallets?account=${accountId}`));
      return res;
    });
  });

  if (state.error) {
    return (
      <div>
        <h3 className="font-bold text-lg mb-8">{title}</h3>
        <div className="text-error">{state.error.message}</div>
      </div>
    );
  }

  if (!isLoading && !availableAssets.length && !error) {
    return (
      <div>
        <h3 className="font-bold text-lg mb-8">{title}</h3>
        <div className="text-warning">The account has already all available wallet assets</div>
      </div>
    );
  }

  if (state.loading) {
    return (
      <div>
        <h3 className="font-bold text-lg mb-8">{title}</h3>
        <div className="flex space-x-4 items-center">
          <button className="btn btn-ghost loading"></button>
          <div>Requesting wallet creation...</div>
        </div>
      </div>
    );
  }

  if (state.value) {
    return (
      <div>
        <h3 className="font-bold text-lg mb-8">{title}</h3>
        <div className="text-sm text-success flex items-center space-x-1 mb-3">
          <Icon icon="ph:check-circle-bold" fontSize={20} />
          <div className="font-bold">Wallet created</div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={() => navigate("#")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-8">{title}</h3>
      <form onSubmit={handleSubmit(doCreateWallet)}>
        <div className="form-control w-full">
          <label className="label" htmlFor="create-wallet-name">
            <span className="label-text">Name</span>
          </label>
          <input
            id="create-wallet-name"
            {...register("name", {
              required: "Name is required",
              maxLength: { value: 50, message: "Name must be between 1 and 50 characters" },
              minLength: { value: 1, message: "Name must be between 1 and 50 characters" },
            })}
            type="text"
            placeholder="e.g.: Savings"
            className={classNames("input input-bordered w-full", { "input-error": errors?.name })}
            required
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.name && <span className="label-text-alt text-error">{errors?.name?.message}</span>}
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label" htmlFor="create-wallet-asset">
            <span className="label-text">Asset</span>
          </label>
          <select
            id="create-wallet-asset"
            {...register("assetId", {
              required: "Asset is required",
            })}
            className="select select-bordered w-full"
          >
            {availableAssets.map((asset) => (
              <option key={asset.assetId} value={asset.assetId}>
                {asset.assetId} - {asset.name}
              </option>
            ))}
          </select>
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.assetId && <span className="label-text-alt text-error">{errors?.assetId?.message}</span>}
          </label>
        </div>
        <div className="modal-action">
          <button type="button" className="btn" onClick={() => navigate("#")}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Wallet
          </button>
        </div>
      </form>
    </div>
  );
}
