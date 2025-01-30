import { Icon } from "@iconify/react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Vault } from "../../../types/types";
import { icons } from "../../constants";

export const VaultListItem = (props: Props) => {
  const { vault } = props;

  const navigate = useNavigate();

  const link = `/vaults/${vault.vaultId}`;

  return (
    <tr className="hover">
      <td className="cursor-pointer" onClick={() => navigate(link)}>
        <div className="flex items-center space-x-3">
          <Icon icon={icons.vault} className="w-6 h-6" />
          <div>
            <div>{vault.name}</div>
            <div className="tooltip" data-tip={`Created ${moment(vault.createdAt).fromNow()}`}>
              <div className="text-sm opacity-50">{moment(vault.createdAt).format("lll")}</div>
            </div>
          </div>
        </div>
      </td>
      <td className="text-right">
        <StatusBadge vault={vault} />
      </td>
    </tr>
  );
};

type Props = {
  vault: Vault;
};

// ================================================
/** status badge */
function StatusBadge(props: { vault: Vault }) {
  const { vault } = props;
  let stateClass = "text-warning";
  if ("COMPLETED" === vault.status) {
    stateClass = "text-success";
  } else if (vault.status.includes("FAIL")) {
    stateClass = "text-error";
  }
  return <div className={`badge badge-outline text-xs ${stateClass}`}>{vault.status}</div>;
}

// ================================================
/** Loading skeleton */
export const VaultListItemSkeleton = () => {
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
