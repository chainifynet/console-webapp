import { useParams } from "react-router-dom";
import { TxList } from "./TxList";
import { WalletInfo } from "./WalletInfo";

export const WalletTransactions = () => {
  const { vaultId, walletId } = useParams();
  if (!vaultId || !walletId) return <p>Could not load Wallet</p>;
  return (
    <div>
      <WalletInfo vaultId={vaultId} walletId={walletId} />
      <div className="h-8" /> {/* spacer */}
      <TxList vaultId={vaultId} walletId={walletId} />
    </div>
  );
};
