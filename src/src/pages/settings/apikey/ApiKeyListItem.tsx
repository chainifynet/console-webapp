import { User } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ApiKey } from "../../../../types/types";
import { Scope, hasScope } from "../../../lib/utils/user";
import classNames from "classnames";

// TODO add roles
export const ApiKeyListItem = (props: Props) => {
  const navigate = useNavigate();
  const { apiKey, currentUser } = props;

  const expiresAt = moment(apiKey.expiresAt);
  const hasExpired = expiresAt.isBefore(moment());
  const createdAt = moment(apiKey.createdAt);

  return (
    <tr className="">
      <td>
        <div className="flex items-center space-x-3">
          <div>
            <div>{apiKey.name}</div>
            <div className="tooltip" data-tip={`Created ${createdAt.fromNow()}`}>
              <div className="text-sm opacity-50">{createdAt.format("lll")}</div>
            </div>
            <div className="text-sm mt-2 flex">
              <span className="opacity-50 bg-base-300 p-1 rounded-md ">{apiKey.apiKeyId}</span>
            </div>
          </div>
        </div>
      </td>
      <td>
        <div>
          <div className="tooltip" data-tip={`${hasExpired ? "Expired" : "Expires"} ${expiresAt.fromNow()}`}>
            <div className={classNames("text-sm", { "text-error": hasExpired })}>{expiresAt.format("lll")}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="flex space-x-3">
          <ul>
            {apiKey.permissions.map((permission, i) => (
              <li className="text-xs" key={i}>
                {permission}
              </li>
            ))}
          </ul>
        </div>
      </td>

      <td>
        <div className="flex space-x-3">
          <ul>
            {!apiKey.allowedCidrs?.length && <li className="text-xs font-bold opacity-60">Any Allowed</li>}
            {apiKey.allowedCidrs?.map((ip, i) => (
              <li className="text-xs font-mono" key={i}>
                {ip}
              </li>
            ))}
          </ul>
        </div>
      </td>

      <td className="text-right">
        {hasScope(Scope.WriteOrgApiKey, currentUser) && (
          <div className="tooltip tooltip-left" data-tip={`Update API key`}>
            <button
              className="btn btn-square btn-outline btn-sm"
              onClick={() => navigate(`./${apiKey.apiKeyId}#update`)}
            >
              <Icon icon="ph:pencil-bold" className="w-4 h-4" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

type Props = {
  apiKey: ApiKey;
  currentUser?: User;
};

// ================================================
/** Loading skeleton */
export const ApiKeyListItemSkeleton = () => {
  return (
    <div className="w-full flex mb-10">
      {/* Column 1  */}
      <div className="w-3/6 mr-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-base-content bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="w-full">
            <div className="w-3/4 h-4 bg-base-content bg-opacity-10 rounded animate-pulse mb-2"></div>
            <div className="w-1/2 h-4 bg-base-content bg-opacity-10 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* <!-- Column 2 --> */}
      <div className="w-2/6 mr-10">
        <div className="h-4 bg-base-content bg-opacity-10 rounded animate-pulse"></div>
      </div>

      {/* <!-- Column 3 --> */}
      <div className="w-1/6">
        <div className="h-4 bg-base-content bg-opacity-10 rounded animate-pulse mb-2"></div>
        <div className="h-4bg-base-content bg-opacity-10 rounded animate-pulse"></div>
      </div>
    </div>
  );
};
