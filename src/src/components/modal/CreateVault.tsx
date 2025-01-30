import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import useApi from "../../hooks/useApi";
import { useTokenSilently } from "../../hooks/useTokenSilently";
import * as api from "../../lib/api/api";

const title = "Create Vault";

const CreateVault: React.FC = () => {
  const navigate = useNavigate();
  const getAccessTokenSilently = useTokenSilently();

  const [name, setName] = useState("");
  const [nameValidError, setNameValidError] = useState("");

  const [doCreateVault, state, reset] = useApi(async () => {
    try {
      validateName(name);
    } catch (err: any) {
      setNameValidError(err.message);
      return;
    }
    const token = await getAccessTokenSilently();
    return api.createVault(token, name);
  });

  // reset on unmount
  useEffect(() => {
    return () => {
      setName("");
      setNameValidError("");
      reset();
    };
  }, []);

  // revalidate vaul list on success
  useEffect(() => {
    if (state.value) {
      mutate(unstable_serialize(() => "/vaults"));
    }
  }, [state.value]);

  if (state.error) {
    return (
      <div>
        <h3 className="font-bold text-lg mb-8">{title}</h3>
        <div className="text-error">{state.error.message}</div>
      </div>
    );
  }

  if (state.loading) {
    return (
      <div>
        <h3 className="font-bold text-lg mb-8">{title}</h3>
        <div className="flex space-x-4 items-center">
          <button className="btn btn-ghost loading"></button>
          <div>Requesting vault creation...</div>
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
          <div className="font-bold">Vault created, will be initialized shortly</div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={() => navigate("#")}>
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/vaults/${state.value?.vaultId}`, { replace: true })}
          >
            Go To Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-8">{title}</h3>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          placeholder="e.g.: Operations"
          className={classNames("input input-bordered w-full", { "input-error": nameValidError })}
          required
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
      </div>
      <div className="modal-action">
        <button className="btn" onClick={() => navigate("#")}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={doCreateVault}>
          Create Vault
        </button>
      </div>
    </div>
  );
};

export default CreateVault;

function validateName(name: string): boolean {
  if (name.length < 0 || name.length > 50) {
    throw new Error("Name must be between 1 and 50 characters");
  }
  return true;
}
