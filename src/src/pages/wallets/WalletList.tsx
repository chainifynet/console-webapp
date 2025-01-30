import { useDispatch, useSelector } from "react-redux";
import { useWallets } from "../../hooks/fetch/useWallets";
import { WalletListItem, WalletListItemSkeleton } from "./WalletListItem";

import { Dispatch, RootState } from "../../store";
import { Watermark } from "../../components/watermark/Watermark";
import { useEffect } from "react";
import PaginationControl from "../../components/PaginationControl";

const loadingSkeletonItems = Array.from({ length: 6 });

export const WalletList: React.FC<Props> = ({ address, accountId }) => {
  const { data, isLoading, error, size, setSize, isEnd } = useWallets({ accountId, address });
  const prices = useSelector((state: RootState) => state.prices);
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (error) {
    return <Watermark text="Wallet List could not be loaded" />;
  }

  if (isLoading || !data?.length || data?.length < size) {
    return <Loading />;
  }

  if (address && !data[size - 1].wallets?.length) {
    return <Watermark text={`No wallets found for address`} />;
  }

  if (!data[size - 1].wallets?.length) {
    return <Watermark text="No wallets" />;
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="table w-full [&_tr.hover:hover_*]:!bg-base-200">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Address</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {/* show only current page */}
            {data[size - 1].wallets.map((wallet, i) => (
              <WalletListItem wallet={wallet} prices={prices} key={i} />
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControl
        page={size}
        setPage={setSize}
        isLast={isEnd}
        currentPageItemCount={data[size - 1].wallets.length}
      />
    </div>
  );
};

function Loading() {
  return (
    <div className="container mt-10">
      {loadingSkeletonItems.map((_, i) => (
        <WalletListItemSkeleton key={i} />
      ))}
    </div>
  );
}

type Props = {
  /** provide either address or accountId but not both */
  address?: string;
  /** provide either address or accountId but not both */
  accountId?: string;
};
