import { Icon } from "@iconify/react";
import { ApiKey } from "../../../../types/types";
import useApi from "../../../hooks/useApi";
import { useTokenSilently } from "../../../hooks/useTokenSilently";
import * as apiKeyClient from "../../../lib/api/apiKey";
import { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../store";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

const mainPath = "/settings/apikeys";

export function ConfirmDelete({ apiKey, cancelledCb }: { apiKey: ApiKey; cancelledCb: () => void }) {
  const getAccessTokenSilently = useTokenSilently();
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const [doDelete, state] = useApi(async () => {
    const token = await getAccessTokenSilently();
    return apiKeyClient
      .deleteApiKey(token, apiKey.apiKeyId)
      .then((res) => {
        mutate(`/apikeys`);
        return res;
      })
      .catch((err) => {
        dispatch.errors.set(err?.message);
        throw err;
      });
  });

  if (state.value) {
    return (
      <div>
        <h1 className="text-xl font-bold opacity-40 mb-10">{state.value?.name}</h1>
        <div className="text-sm text-warning flex items-center space-x-1 mb-3">
          <Icon icon="ph:check-circle-bold" fontSize={20} />
          <div className="font-bold">
            <div>Deleted API Key</div>
          </div>
        </div>
        <div className="text-sm font-mono p-1 bg-base-300 rounded-md text-center">{state.value?.apiKeyId}</div>

        <div className="modal-action">
          <button className="btn" onClick={() => navigate(mainPath)}>
            Ok
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold opacity-40 mb-10">API Key: {apiKey?.name}</h1>
      <div className="text-center">
        <div className="text-sm text-warning flex items-center space-x-1 mb-6 justify-center">
          <Icon icon="ph:warning-bold" fontSize={20} />
          <div className="font-bold">This action cannot be undone</div>
        </div>
        <div className="label-text mb-2">You will delete the following API Key</div>
        <div className="text-sm font-mono p-1 bg-base-300 rounded-md mb-6">{apiKey.apiKeyId}</div>
        <button className={classNames("btn btn-error", { loading: state.loading })} onClick={() => doDelete()}>
          Confirm Delete
        </button>
      </div>

      <div className="modal-action">
        <button className="btn" onClick={() => cancelledCb()} disabled={state.loading}>
          Cancel
        </button>
      </div>
    </div>
  );
}
