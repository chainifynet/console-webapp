import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import { OrgRoleGroup } from "../../../types/types";
import useApi from "../../hooks/useApi";
import { useTokenSilently } from "../../hooks/useTokenSilently";
import * as userApi from "../../lib/api/user";
import { Dispatch } from "../../store";

interface FormData {
  email: string;
  orgRole: OrgRoleGroup;
}

export default function InviteUser() {
  const getAccessTokenSilently = useTokenSilently();
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      orgRole: "",
    },
  });

  const [doSubmit, state] = useApi(async (data: FormData) => {
    const token = await getAccessTokenSilently();
    return userApi
      .sendInvite(token, data)
      .then((res) => {
        if (res) {
          // revalidate org users success
          mutate(unstable_serialize(() => "/orgs/users"));
        }
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
        <h1 className="text-xl font-bold opacity-40 mb-10">Invite User</h1>
        <div className="text-sm text-success flex items-center space-x-1 mb-3">
          <Icon icon="ph:check-circle-bold" fontSize={20} />
          <div className="font-bold">User Invited</div>
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
      <h1 className="text-xl font-bold opacity-40">Invite User</h1>
      <form className="form-control mt-4 mb-4 flex flex-col " onSubmit={handleSubmit((data) => doSubmit(data))}>
        <div className="w-fit">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
            id="email"
            type="text"
            disabled={state.loading}
            className={classNames("input input-bordered", {
              "input-error": Boolean(errors?.email),
            })}
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.email && <span className="label-text-alt text-error">{errors?.email?.message}</span>}
          </label>
        </div>

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
          <button type="submit" className={classNames("btn btn-primary", { loading: state.loading })}>
            Send Invite
          </button>
        </div>
      </form>
    </div>
  );
}
