import { useDispatch } from "react-redux";
import { useVaults } from "../../hooks/api";
import { VaultListItem, VaultListItemSkeleton } from "./VaultListItem";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaginationControl from "../../components/PaginationControl";
import { Watermark } from "../../components/watermark/Watermark";
import { Scope, hasScope } from "../../lib/utils/user";
import { Dispatch } from "../../store";

const loadingSkeletonItems = Array.from({ length: 6 });

const VaultList: React.FC = () => {
  const { data, isLoading, error, size, setSize, isEnd } = useVaults();
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const { user } = useAuth0();

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (error) {
    return <Watermark text="Vault List could not be loaded" />;
  }

  if (isLoading || !data?.length || data?.length < size) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col">
      <div>
        {hasScope(Scope.WriteVaults, user) && (
          <button className="btn mb-4" onClick={() => navigate("#createvault")}>
            Create Vault
          </button>
        )}
      </div>
      {!data[size - 1].vaults?.length ? (
        <Watermark text="No vaults" />
      ) : (
        <>
          <div className="overflow-x-auto w-full">
            <table className="table w-full [&_tr.hover:hover_*]:!bg-base-200">
              <thead>
                <tr>
                  <th>Vault</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* show only current page */}
                {data[size - 1].vaults.map((vault, i) => (
                  <VaultListItem vault={vault} key={i} />
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControl
            page={size}
            setPage={setSize}
            isLast={isEnd}
            currentPageItemCount={data[size - 1].vaults.length}
          />
        </>
      )}
    </div>
  );
};

export default VaultList;

function Loading() {
  return (
    <div className="container mt-10">
      {loadingSkeletonItems.map((_, i) => (
        <VaultListItemSkeleton key={i} />
      ))}
    </div>
  );
}
