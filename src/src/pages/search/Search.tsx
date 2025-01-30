import { useQueryParam } from "../../hooks/useQueryParam";
import { getKind } from "../../lib/utils/coin";
import { WalletList } from "../wallets/WalletList";

const Search = () => {
  const searchTerm = useQueryParam("q");

  const kind = getKind(searchTerm);
  if (kind?.endsWith("ADDRESS")) {
    return (
      <div>
        <h1 className="text-xl font-bold mb-7">Address Search</h1>
        <WalletList address={searchTerm} />
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-xl font-bold mb-7">Transaction Search</h1>
    </div>
  );
};

export default Search;
