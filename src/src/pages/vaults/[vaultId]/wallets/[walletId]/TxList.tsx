import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaginationControl from "../../../../../components/PaginationControl";
import { Watermark } from "../../../../../components/watermark/Watermark";
import { useTxs } from "../../../../../hooks/api";
import { Dispatch, RootState } from "../../../../../store";
import { TxListItem, TxListItemSkeleton } from "./TxListItem";

const loadingSkeletonItems = Array.from({ length: 6 });

export const TxList: React.FC<Props> = ({ vaultId, walletId }) => {
  const { data, isLoading, error, size, setSize, isEnd } = useTxs(vaultId, walletId);
  const prices = useSelector((state: RootState) => state.prices);
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (error) {
    return <Watermark text="Tx List could not be loaded" />;
  }

  if (isLoading || !data?.length || data?.length < size) {
    return <Loading />;
  }

  if (!data[size - 1]?.transactions?.length) {
    return <Watermark text="No transactions" />;
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th className="text-center">
                <div className="flex space-x-1 ">
                  <span>From | To</span>
                </div>
                {/* <div className="flex space-x-1 justify-center items-center">
                  <span>From</span>
                  <Icon icon="ph:arrow-right-bold" />
                  <span>To</span>
                </div> */}
              </th>
              <th className="text-center">Status</th>
              <th className="text-center">Type</th>
              <th className="text-right">Miner Fee</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* show only current page */}
            {data[size - 1].transactions.map((tx, i) => (
              <TxListItem tx={tx} prices={prices} key={tx.txId} />
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControl
        page={size}
        setPage={setSize}
        isLast={isEnd}
        currentPageItemCount={data[size - 1].transactions.length}
      />
    </div>
  );
};

function Loading() {
  return (
    <div className="container mt-10">
      {loadingSkeletonItems.map((_, i) => (
        <TxListItemSkeleton key={i} />
      ))}
    </div>
  );
}

type Props = {
  vaultId: string;
  walletId: string;
};
