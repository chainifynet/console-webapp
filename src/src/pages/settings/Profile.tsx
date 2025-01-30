import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { InviteListItem } from "../../components/invite/InviteListItem";
import { useOrgInvites } from "../../hooks/fetch/useOrgInvites";
import useApi from "../../hooks/useApi";
import { useTokenSilently } from "../../hooks/useTokenSilently";
import * as userApi from "../../lib/api/user";
import { Dispatch, RootState } from "../../store";

interface FormData {
  firstname: string;
  lastname: string;
}

export function Profile() {
  const getAccessTokenSilently = useTokenSilently();
  const dispatch = useDispatch<Dispatch>();

  const [changingOrg, setChangingOrg] = useState("");
  const userData = useSelector((state: RootState) => state.user);
  const currentUser = userData?.user;
  const { data: invites, isLoading } = useOrgInvites();

  const [editable, setEditable] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: currentUser?.firstname,
      lastname: currentUser?.lastname,
    },
  });

  useEffect(() => {
    reset({
      firstname: currentUser?.firstname,
      lastname: currentUser?.lastname,
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

  const fetchCurrentUser = async () => {
    const token = await getAccessTokenSilently();
    await dispatch.user.fetchCurrentUser(token);
  };

  return (
    <div>
      <h1 className="text-xl font-bold opacity-40">Profile Settings</h1>
      <div className="font-semibold opacity-80 mt-2">{currentUser?.email}</div>
      <form className="form-control w-fit mt-4 mb-4 flex flex-col " onSubmit={handleSubmit((data) => doSubmit(data))}>
        <div>
          <label className="label">
            <span className="label-text">Fist Name</span>
          </label>
          <input
            {...register("firstname", {
              required: "First Name is required",
              minLength: { value: 2, message: "Min length is 2 characters" },
              maxLength: { value: 100, message: "Max length is 100 characters" },
            })}
            type="text"
            disabled={!editable}
            className={classNames("input input-bordered", {
              "input-error": Boolean(errors?.firstname),
            })}
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.firstname && <span className="label-text-alt text-error">{errors?.firstname?.message}</span>}
          </label>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            {...register("lastname", {
              required: "Last Name is required",
              minLength: { value: 2, message: "Min length is 2 characters" },
              maxLength: { value: 100, message: "Max length is 100 characters" },
            })}
            type="text"
            // value={currentUser?.user?.lastname}
            disabled={!editable}
            className={classNames("input input-bordered ", {
              "input-error": Boolean(errors?.lastname),
            })}
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.lastname && <span className="label-text-alt text-error">{errors?.lastname?.message}</span>}
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
                  reset({
                    firstname: currentUser?.firstname,
                    lastname: currentUser?.lastname,
                  });
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

      {/* Organizations section */}
      <div className="divider" />
      <h1 className="text-xl font-bold opacity-40 mb-5">Organizations</h1>
      <div className="flex flex-col space-y-4">
        {userData?.orgs?.map((org) => (
          <div className="flex space-x-2" key={org.orgId}>
            <div>
              <span className="font-bold">{org.orgRoles?.[0]}</span> in
            </div>
            <div
              className={classNames("badge badge-lg ", {
                "badge-secondary": org.orgId === userData?.orgId,
              })}
              key={org.orgId}
            >
              {org.tenant}
            </div>
            {org.orgId !== userData?.orgId && (
              <button
                className={classNames("btn btn-xs", {
                  loading: changingOrg === org.orgId,
                  "btn-disabled": Boolean(changingOrg) && changingOrg !== org.orgId,
                })}
                onClick={async () => {
                  setChangingOrg(org.orgId);
                  localStorage.setItem(`orgId@@${currentUser?.email}`, org.orgId);
                  try {
                    await getAccessTokenSilently();
                  } finally {
                    setChangingOrg("");
                  }
                  // Force a full browser refresh
                  window.location.reload();
                }}
              >
                Change Org
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Invites section */}
      {invites?.length > 0 && (
        <>
          <div className="divider" />
          <h1 className="text-xl font-bold opacity-40 mb-5">Pending Invites</h1>
          <table className="table [&_tr.hover:hover_*]:!bg-base-200">
            <tbody>
              {invites.map((invite, i) => (
                <InviteListItem invite={invite} onAccepted={fetchCurrentUser} key={i} />
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
