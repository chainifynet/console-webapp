import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useTimeoutFn } from "react-use";
import { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import { Wallet } from "../../../../types/types";
import { FeeEstimate } from "../../../hooks/fetch/useFeeEstimate";
import useApi from "../../../hooks/useApi";
import { useTokenSilently } from "../../../hooks/useTokenSilently";
import * as api from "../../../lib/api/api";
import { Asset, explorerAddressUrl, fromNative, inputToUSD, toNative } from "../../../lib/utils/coin";
import { FeeAndRemaining } from "./Common";

interface Props {
  wallet: Wallet;
  asset: Asset;
  params: { address: string; amount: string; note?: string };
  fee: FeeEstimate;
  prices: Record<string, number>;
  remaining?: string;
  onBackClicked: () => void;
}
const SendConfirm: React.FC<Props> = (props) => {
  const { wallet, params, asset, onBackClicked, fee, prices, remaining } = props;
  const getAccessTokenSilently = useTokenSilently();

  const [enabledConfirm, setEnabledConfirm] = useState(false);

  const [doSend, state, reset] = useApi(async () => {
    const token = await getAccessTokenSilently();
    return api.send(token, wallet.vaultId, wallet.walletId, {
      toAddress: params.address,
      amount: toNative(params.amount, wallet.assetId),
      assetId: asset.assetId,
      note: params.note,
    });
  });

  const sendingOrSent = state.loading || state.value;

  const [, cancelTimeout] = useTimeoutFn(() => {
    setEnabledConfirm(true);
  }, 3000);

  // reset api on unmount
  useEffect(() => {
    return () => {
      cancelTimeout();
      reset();
    };
  }, []);

  // revalidate tx list on success
  useEffect(() => {
    if (state.value) {
      mutate(unstable_serialize(() => `/vaults/${state.value?.vaultId}/wallets/${state.value?.walletId}/txs`));
    }
  }, [state.value]);

  if (state.error) {
    return (
      <div>
        <div className="alert alert-error shadow-lg justify-center mt-6">
          <div>
            <Icon icon="ph:x-circle-bold" />
            <span>Failed send</span>
          </div>
        </div>
        <div className="text-error mt-6">{state.error.message}</div>
      </div>
    );
  }

  return (
    <div>
      {state.loading && (
        <div className="flex justify-center mt-6">
          <div className="btn btn-ghost loading">Sending...</div>
        </div>
      )}
      {state.value && (
        <>
          <div className="alert alert-success shadow-lg justify-center mt-6">
            <div>
              <Icon icon="ph:check-circle-bold" />
              <span>Send submitted</span>
            </div>
          </div>
          <TxDataSection
            address={state.value.to}
            amount={fromNative(state.value.amount, state.value.assetId)}
            assetId={state.value.assetId}
            note={state.value.note}
            prices={prices}
            sendingOrSent={sendingOrSent}
          />
        </>
      )}

      {!state.value && (
        <TxDataSection
          address={params.address}
          amount={params.amount}
          assetId={asset.assetId}
          note={params.note}
          prices={prices}
          sendingOrSent={sendingOrSent}
        />
      )}

      <div>
        <FeeAndRemaining asset={asset} fee={fee} prices={prices} remaining={remaining} dim={true} />
      </div>

      {!sendingOrSent && (
        <ConfirmButtons state={state} enabledConfirm={enabledConfirm} onBackClicked={onBackClicked} doSend={doSend} />
      )}
    </div>
  );
};

export default SendConfirm;

function TxDataSection(props: any) {
  const { address, amount, assetId, note, sendingOrSent, prices } = props;
  return (
    <div className={classNames("flex flex-col space-y-8 my-10", { "opacity-60": sendingOrSent })}>
      <div className="flex justify-between px-1">
        <label className="font-bold opacity-60">To</label>
        <div className="text-end font-mono">
          <div className="font-bold">{address}</div>
          <div className="text-xs opacity-60 align-center">
            <a
              className="whitespace-nowrap no-underline inline-flex items-center"
              href={explorerAddressUrl(assetId, address)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="mr-1">View in explorer</span>
              <Icon icon="ph:arrow-square-out-bold" />
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-between px-1">
        <label className="font-bold opacity-60">Amount</label>
        <div className="text-end">
          <div>
            <span className="mr-1 font-bold text-2xl">{amount}</span>
            <span className="">{assetId}</span>
          </div>
          <div>
            <span className="font-bold">{inputToUSD(amount, assetId, prices)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between px-1">
        <label className="font-bold opacity-60">Note</label>
        <div className="text-end">
          <div>{note}</div>
        </div>
      </div>
    </div>
  );
}

function ConfirmButtons(props: any) {
  const { state, enabledConfirm, onBackClicked, doSend } = props;
  return (
    <>
      <div className="text-warning text-sm mt-10 flex items-center space-x-2 px-1">
        <Icon icon="ph:warning-bold" />
        <span>Once you confirm, the coins will be sent, this cannot be reverted.</span>
      </div>

      <div className="mt-12"></div>
      <div className="modal-action">
        <button className={classNames("btn", { "btn-disabled": state.loading })} onClick={onBackClicked}>
          Back
        </button>
        <div
          className={classNames("left-to-right-fill rounded-md bg-primary bg-opacity-20", {
            "opacity-80": !enabledConfirm,
          })}
        >
          <button
            className={classNames("btn btn-ghost text-gray-100", {
              loading: state.loading,
              "btn-disabled": !enabledConfirm,
            })}
            onClick={doSend}
          >
            Confirm Send
          </button>
        </div>
      </div>
    </>
  );
}
