import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useApi from "../../../hooks/useApi";
import { useTokenSilently } from "../../../hooks/useTokenSilently";
import * as userApi from "../../../lib/api/user";
import { Dispatch, RootState } from "../../../store";
import { Icon } from "@iconify/react";

interface FormData {
  firstname: string;
  lastname: string;
}

export function Integration() {
  const getAccessTokenSilently = useTokenSilently();
  const dispatch = useDispatch<Dispatch>();

  const userData = useSelector((state: RootState) => state.user);
  const currentUser = userData?.user;

  const [editable, setEditable] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      chainalysisKytApiKey: "****",
      chainalysisEnabled: false,
    },
  });

  const chainalysisEnabled = watch("chainalysisEnabled");

  useEffect(() => {
    reset({
      chainalysisKytApiKey: "****",
      chainalysisEnabled: false,
    });
  }, [currentUser?.firstname, currentUser?.lastname]);

  const [doSubmit, state] = useApi(async (data: FormData) => {
    const token = await getAccessTokenSilently();
    return userApi
      .updateUserProfile(token, data)
      .then((newUser) => {
        setEditable(false);
        dispatch.user.updateUser(newUser);
        return newUser;
      })
      .catch((err) => {
        setEditable(false);
        dispatch.errors.set(err?.message);
        throw err;
      });
  });

  return (
    <div>
      <h1 className="text-xl font-bold opacity-40">Integrations</h1>
      <div className="font-semibold opacity-80 mt-2">
        <div className="flex items-center space-x-1">
          <div className="relative inline-flex text-sm font-medium text-center">
            <Icon icon="@custom:vendor:chainalysis" width="24" color="#ec5f2a" />
          </div>
          <div>
            <div>Chainalysis</div>
          </div>
        </div>
      </div>
      <form className="form-control w-fit mt-4 mb-4 flex flex-col " onSubmit={handleSubmit((data) => doSubmit(data))}>
        <div>
          <label className="label">
            <span className="label-text">Chainalysis KYT API Key</span>
          </label>
          <input
            {...register("chainalysisKytApiKey", {
              required: "First Name is required",
              minLength: { value: 2, message: "Min length is 2 characters" },
              maxLength: { value: 100, message: "Max length is 100 characters" },
            })}
            type="text"
            disabled={!editable}
            className={classNames("input input-bordered", {
              "input-error": Boolean(errors?.chainalysisKytApiKey),
            })}
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.chainalysisKytApiKey && (
              <span className="label-text-alt text-error">{errors?.chainalysisKytApiKey?.message}</span>
            )}
          </label>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Enabled</span>
          </label>
          <input
            {...register("chainalysisEnabled")}
            type="checkbox"
            // value={currentUser?.user?.lastname}
            className="toggle"
            checked={chainalysisEnabled}
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.chainalysisEnabled && (
              <span className="label-text-alt text-error">{errors?.chainalysisEnabled?.message}</span>
            )}
          </label>
        </div>

        <div>
          {editable ? (
            <div className="btn-group">
              <button
                type="button"
                className="btn"
                disabled={state.loading}
                onClick={() => {
                  setEditable(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className={classNames("btn btn-primary", { loading: state.loading })}>
                Save
              </button>
            </div>
          ) : (
            <button type="button" className="btn" onClick={() => setEditable(true)}>
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
