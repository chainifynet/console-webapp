import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import { OrgRoleGroup, OrgUserStatus } from "../../../types/types";
import { useOrgUser } from "../../hooks/fetch/useOrgUser";
import useApi from "../../hooks/useApi";
import { useTokenSilently } from "../../hooks/useTokenSilently";
import * as userApi from "../../lib/api/user";
import { Dispatch } from "../../store";

interface FormData {
  orgRole: OrgRoleGroup;
}

const mainPath = "/settings/users";

export default function UpdateUser() {
  const getAccessTokenSilently = useTokenSilently();
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const { userId = "" } = useParams();
  const { data } = useOrgUser(userId);

  const userOrInvite = data?.orgUserStatus === OrgUserStatus.INVITED ? "Invite" : "User";

  const [confirmDelete, setConfirmDelte] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      orgRole: data?.orgRoles?.[0],
    },
  });

  const watchedOrgRole = watch("orgRole");

  useEffect(() => {
    if (!data) return;
    reset({
      orgRole: data?.orgRoles?.[0],
    });
  }, [data]);

  const [doDelete, deleted] = useApi(async () => {
    if (!userId) return;
    const token = await getAccessTokenSilently();
    return userApi
      .deleteUser(token, userId)
      .then((res) => {
        mutate(unstable_serialize(() => "/orgs/users"));
        return true;
      })
      .catch((err) => {
        dispatch.errors.set(err?.message);
        throw err;
      });
  });

  const [doSubmit, state] = useApi(async (data: FormData) => {
    if (!userId) return;
    const token = await getAccessTokenSilently();
    return userApi
      .updateUser(token, userId, data)
      .then((res) => {
        mutate(`/orgs/users/${userId}`);
        mutate(unstable_serialize(() => "/orgs/users"));
        return res;
      })
      .catch((err) => {
        dispatch.errors.set(err?.message);
        throw err;
      });
  });

  if (deleted.value) {
    return (
      <div>
        <h1 className="text-xl font-bold opacity-40 mb-10">{data?.userEmail}</h1>
        <div className="text-sm text-warning flex items-center space-x-1 mb-3">
          <Icon icon="ph:check-circle-bold" fontSize={20} />
          <div className="font-bold">{userOrInvite} Deleted</div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={() => navigate(mainPath)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (confirmDelete) {
    return (
      <div>
        <h1 className="text-xl font-bold opacity-40 mb-10">{data?.userEmail}</h1>
        <div className="text-center">
          <div className="text-sm text-warning flex items-center space-x-1 mb-3 justify-center">
            <Icon icon="ph:warning-bold" fontSize={20} />
            <div className="font-bold">This action cannot be undone</div>
          </div>
          <button className="btn btn-error" onClick={() => doDelete()}>
            Confirm Delete
          </button>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={() => setConfirmDelte(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold opacity-40">{data?.userEmail}</h1>
      <form
        className="form-control mt-4 mb-4 flex flex-col "
        onSubmit={handleSubmit((data) => {
          doSubmit(data);
        })}
      >
        <div className="w-fit">
          <label className="label" htmlFor="role">
            <span className="label-text">Role</span>
          </label>
          <select
            {...register("orgRole", {
              required: "Role is required",
            })}
            className="select select-bordered"
            id="role"
            disabled={state.loading}
          >
            <option disabled defaultValue={""} value="">
              -- Role --
            </option>
            {Object.values(OrgRoleGroup)
              .filter((r) => r !== OrgRoleGroup.OWNER) // cannot invite owner
              .map((role) => (
                <option value={role} key={role}>
                  {role}
                </option>
              ))}
          </select>
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.orgRole && <span className="label-text-alt text-error">{errors?.orgRole?.message}</span>}
          </label>
        </div>

        <div className="modal-action">
          <button
            type="button"
            className={classNames("btn btn-error")}
            disabled={state.loading}
            onClick={() => setConfirmDelte(true)}
          >
            Delete...
          </button>
          <button
            type="submit"
            className={classNames("btn btn-primary", { loading: state.loading })}
            disabled={!isRoleChanged(watchedOrgRole, data?.orgRoles)}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

function isRoleChanged(watchedOrgRole?: OrgRoleGroup, orgRoles?: OrgRoleGroup[]) {
  if (!watchedOrgRole || !orgRoles) return false;
  return !orgRoles.includes(watchedOrgRole);
}
