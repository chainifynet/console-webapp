import classNames from "classnames";
import isCidr from "is-cidr";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { mutate } from "swr";
import { ApiKeyPermission, CreateApiKeyRequest } from "../../../../types/types";
import useApi from "../../../hooks/useApi";
import { useTokenSilently } from "../../../hooks/useTokenSilently";
import * as apiKeyClient from "../../../lib/api/apiKey";
import { Dispatch } from "../../../store";
import { ViewApiKey } from "./ViewApiKey";
import moment from "moment";

const title = "Create API Key";

export default function CreateApiKey() {
  const getAccessTokenSilently = useTokenSilently();
  const dispatch = useDispatch<Dispatch>();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      expiresAt: "",
      permissions: {
        [ApiKeyPermission.READ]: false,
        [ApiKeyPermission.CREATE_VAULT]: false,
        [ApiKeyPermission.CREATE_ACCOUNT]: false,
        [ApiKeyPermission.CREATE_WALLET]: false,
        [ApiKeyPermission.SPENDER]: false,
      },
      allowedCidrs: "",
      perms: "",
    },
  });

  const validatePermissions = () => {
    const permissions = getValues("permissions");
    const hasAny = Object.values(permissions).some(Boolean);
    if (!hasAny) {
      return "At least one permission must be checked.";
    }
  };

  const [doSubmit, state] = useApi(async (data: CreateApiKeyRequest) => {
    const token = await getAccessTokenSilently();
    return apiKeyClient
      .createApiKey(token, data)
      .then((res) => {
        mutate(`/apikeys`);
        return res;
      })
      .catch((err) => {
        dispatch.errors.set(err?.message);
        throw err;
      });
  });

  if (state.loading) {
    return (
      <div>
        <h3 className="font-bold text-lg mb-8">{title}</h3>
        <div className="flex space-x-4 items-center">
          <button className="btn btn-ghost loading"></button>
          <div>Creating API key...</div>
        </div>
      </div>
    );
  }

  if (state.value) {
    return <ViewApiKey apiKey={state.value} title={title} />;
  }

  return (
    <div>
      <h1 className="font-bold">{title}</h1>
      <form
        className="form-control mt-4 mb-4 flex flex-col"
        onSubmit={handleSubmit((data) => {
          const cidrs = toCidrList(data.allowedCidrs);
          const req = {
            name: data.name,
            expiresAt: data.expiresAt,
            permissions: toPermissionArray(data.permissions),
          } as any;
          if (cidrs?.length) {
            req.allowedCidrs = cidrs;
          }
          doSubmit(req);
        })}
      >
        <div>
          <div>
            <label className="label">
              <span className="label-text">Name*</span>
            </label>
            <input
              {...register("name", { required: "Name is required", maxLength: 100 })}
              type="text"
              placeholder={`e.g.: local`}
              className={classNames("input input-bordered w-full", { "input-error": Boolean(errors?.name?.type) })}
            />
            <label className="label">
              <span className="label-text-alt">&nbsp;</span>
              {errors.name && <span className="label-text-alt text-error">{errors?.name?.message}</span>}
            </label>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Expiration*</span>
            </label>
            <input
              {...register("expiresAt", { required: "Expiration is required", validate: validateDateFormat })}
              type="text"
              placeholder={`YYYY-MM-DD`}
              className={classNames("input input-bordered w-full", {
                "input-error": Boolean(errors?.expiresAt?.type),
              })}
            />
            <label className="label">
              <span className="label-text-alt">&nbsp;</span>
              {errors.expiresAt && <span className="label-text-alt text-error">{errors?.expiresAt?.message}</span>}
            </label>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Permissions*</span>
            </label>
            <input type="hidden" {...register("perms", { validate: validatePermissions })} />
            <div className="form-control">
              <label className="label cursor-pointer w-fit space-x-4">
                <input {...register("permissions.READ")} type="checkbox" className="checkbox" />
                <span className="label-text">Read</span>
              </label>
              <label className="label cursor-pointer  w-fit space-x-4">
                <input {...register("permissions.CREATE_VAULT")} type="checkbox" className="checkbox" />
                <span className="label-text">Create Vault</span>
              </label>
              <label className="label cursor-pointer  w-fit space-x-4">
                <input {...register("permissions.CREATE_ACCOUNT")} type="checkbox" className="checkbox" />
                <span className="label-text">Create Account</span>
              </label>
              <label className="label cursor-pointer  w-fit space-x-4">
                <input {...register("permissions.CREATE_WALLET")} type="checkbox" className="checkbox" />
                <span className="label-text">Create Wallet</span>
              </label>
              <label className="label cursor-pointer  w-fit space-x-4">
                <input {...register("permissions.SPENDER")} type="checkbox" className="checkbox" />
                <span className="label-text">Spend</span>
              </label>

              <label className="label">
                {errors.perms && <span className="label-text-alt text-error">{errors.perms.message}</span>}
                <span className="label-text-alt">&nbsp;</span>
              </label>
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">White listed CIDRs (separated by new line)</span>
            </label>
            <textarea
              {...register("allowedCidrs", { validate: validateCidrList })}
              placeholder={`10.10.10.100/32\n12.12.12.120/32`}
              className={classNames("textarea textarea-bordered h-24 font-mono", {
                "input-error": Boolean(errors?.allowedCidrs?.type),
              })}
            ></textarea>
            <label className="label">
              <span className="label-text-alt">&nbsp;</span>
              {errors.allowedCidrs && (
                <span className="label-text-alt text-error">{errors?.allowedCidrs?.message}</span>
              )}
            </label>
          </div>
        </div>

        <div className="modal-action">
          <button type="submit" className={classNames("btn btn-primary", { loading: state.loading })}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

function validateDateFormat(value: string) {
  const regex = new RegExp(`^\\d{4}-\\d{2}-\\d{2}$`);
  if (!regex.test(value)) {
    return "Should be a date in the format YYYY-MM-DD";
  }
  const mom = moment(value);
  if (mom.isBefore(moment().add(1, "day")) || mom.isAfter(moment().add(10, "year"))) {
    return "Should be a date between tomorrow and 10 years from now";
  }
}

function toCidrList(value: string) {
  return value
    .split("\n")
    .map((cidr) => cidr.trim())
    .filter((cidr) => cidr.length > 0);
}

function toPermissionArray(value: Record<string, boolean>) {
  return Object.entries(value)
    .filter(([_, enabled]) => enabled)
    .map(([name, _]) => name);
}

function validateCidrList(value: string) {
  const cidrs = toCidrList(value);
  if (cidrs?.length >= 10) {
    return "Should be less than 10 CIDRs";
  }
  const allValid = cidrs.every((cidr) => {
    const res = isCidr(cidr);
    return res === 4;
  });
  return allValid || "Should be a list of CIDRs separated by new line";
}
