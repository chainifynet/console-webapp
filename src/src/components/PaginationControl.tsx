import { Icon } from "@iconify/react";
import { useMemo } from "react";

// TODO make configurable
const batchSize = 50;

const PaginationControl: React.FC<PaginationControlProps> = ({ page, setPage, isLast, currentPageItemCount = 0 }) => {
  const pageLabel = useMemo(() => {
    const start = page * batchSize - (batchSize - 1);
    const end = Math.min(page * batchSize, (page - 1) * batchSize + currentPageItemCount);
    const total = isLast ? end : `more than ${end}`;
    return `${start}-${end} of ${total}`;
  }, [page, isLast, currentPageItemCount]);

  return (
    <div className="flex justify-end items-center space-x-1">
      <div className="text-sm opacity-60">{pageLabel}</div>
      <div className="btn-group justify-end btn-sm">
        <button className="btn text-lg btn-sm" disabled={page === 1} onClick={() => setPage(1)}>
          <Icon icon="ph:caret-double-left-bold" />
        </button>
        <button className="btn text-lg btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
          <Icon icon="ph:caret-left-bold" />
        </button>
        <button className="btn text-lg btn-sm" disabled={isLast} onClick={() => setPage(page + 1)}>
          <Icon icon="ph:caret-right-bold" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControl;

type PaginationControlProps = {
  isLast: boolean;
  page: number;
  setPage: (page: number) => void;
  currentPageItemCount?: number;
};
