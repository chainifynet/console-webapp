import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import PaginationControl from "../../../components/PaginationControl";
import { Watermark } from "../../../components/watermark/Watermark";
import { useAccounts } from "../../../hooks/fetch/useAccounts";
import { Dispatch } from "../../../store";
import { AccountListItem, AccountListItemSkeleton } from "./AccountListItem";

const loadingSkeletonItems = Array.from({ length: 6 });

const VaultList: React.FC = () => {
  const { vaultId = "" } = useParams();
  const { data, isLoading, error, size, setSize, isEnd } = useAccounts(vaultId);
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (error) {
    return <Watermark text="Account List could not be loaded" />;
  }

  if (isLoading || !data?.length || data?.length < size) {
    return <Loading />;
  }

  if (!data[size - 1]?.accounts?.length) {
    return <Watermark text="No accounts for vault" />;
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="table w-full [&_tr.hover:hover_*]:!bg-base-200">
          <thead>
            <tr>
              <th>Account</th>
            </tr>
          </thead>
          <tbody>
            {/* show only current page */}
            {data[size - 1].accounts.map((account, i) => (
              <AccountListItem account={account} key={i} />
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControl
        page={size}
        setPage={setSize}
        isLast={isEnd}
        currentPageItemCount={data[size - 1].accounts.length}
      />
    </div>
  );
};

export default VaultList;

function Loading() {
  return (
    <div className="container mt-10">
      {loadingSkeletonItems.map((_, i) => (
        <AccountListItemSkeleton key={i} />
      ))}
    </div>
  );
}
