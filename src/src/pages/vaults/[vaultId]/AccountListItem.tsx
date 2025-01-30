import { Icon } from "@iconify/react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Account } from "../../../../types/types";
import { icons } from "../../../constants";

export const AccountListItem = (props: Props) => {
  const { account } = props;

  const navigate = useNavigate();

  const link = `/vaults/${account.vaultId}/accounts/${account.accountId}`;

  return (
    <tr className="hover">
      <td className="cursor-pointer" onClick={() => navigate(link)}>
        <div className="flex items-center space-x-3">
          <Icon icon={icons.account} className="w-6 h-6" />
          <div>
            <div>{account.name}</div>
            <div className="tooltip" data-tip={`Created ${moment(account.createdAt).fromNow()}`}>
              <div className="text-sm opacity-50">{moment(account.createdAt).format("lll")}</div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

type Props = {
  account: Account;
};

// ================================================
/** Loading skeleton */
export const AccountListItemSkeleton = () => {
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
