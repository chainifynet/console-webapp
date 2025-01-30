import { User } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { OrgRoleGroup, OrgUserResponse, OrgUserStatus } from "../../../../types/types";
import { icons } from "../../../constants";
import { Scope, hasScope } from "../../../lib/utils/user";
import classNames from "classnames";

// TODO add roles
export const OrgUserListItem = (props: Props) => {
  const navigate = useNavigate();
  const { orgUser, currentUser } = props;

  return (
    <tr className="hover">
      <td>
        <div className="flex items-center space-x-3">
          <Icon
            icon={icons.user}
            className={classNames("w-6 h-6", { "bg-base-300 rounded-md": orgUser.userEmail === currentUser?.email })}
          />
          <div>
            <div>{orgUser.userEmail}</div>

            <div className="tooltip" data-tip={`Created ${moment(orgUser.createdAt).fromNow()}`}>
              <div className="text-sm opacity-50">{moment(orgUser.createdAt).format("lll")}</div>
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className={`badge badge-outline text-xs ${getStatusColor(orgUser.orgUserStatus)}`}>
          {orgUser.orgUserStatus}
        </div>
      </td>
      <td>
        <div className="flex space-x-3">
          {orgUser.orgRoles.map((role, i) => (
            <div className="badge badge-outline text-xs gap-2" key={i}>
              {role}
            </div>
          ))}
        </div>
      </td>

      <td className="text-right">
        {hasScope(Scope.DeleteOrgUsers, currentUser) && !isOwner(orgUser) && (
          <div
            className="tooltip tooltip-left"
            data-tip={`Update ${orgUser.orgUserStatus === OrgUserStatus.INVITED ? "Invitation" : "User"}`}
          >
            <button
              className="btn btn-square btn-outline btn-sm"
              onClick={() => navigate(`./${orgUser.userId}#update`)}
            >
              <Icon icon="ph:pencil-bold" className="w-4 h-4" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

function isOwner(orgUser: OrgUserResponse) {
  return orgUser.orgRoles.includes(OrgRoleGroup.OWNER);
}

function getStatusColor(status: OrgUserStatus) {
  switch (status) {
    case OrgUserStatus.ACTIVE:
      return "text-success";
    case OrgUserStatus.INVITED:
      return "text-warning";
    default:
      return "";
  }
}

type Props = {
  orgUser: OrgUserResponse;
  currentUser?: User;
};

// ================================================
/** Loading skeleton */
export const OrgUserListItemSkeleton = () => {
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
