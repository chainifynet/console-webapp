import { useMemo } from "react";
import { useParams } from "react-router-dom";
import BreadCrumbs from "../../../../../components/BreadCrumbs";
import { WalletList } from "../../../../wallets/WalletList";
import AccountInfo from "./AccountInfo";

const AccountWallets: React.FC = () => {
  const { vaultId, accountId } = useParams();
  if (!vaultId || !accountId) return <div>Could not load Account</div>;

  const br = useMemo(
    () => [
      {
        label: "Vaults",
        link: "/vaults",
      },
      {
        label: "Accounts",
        link: `/vaults/${vaultId}`,
      },
    ],
    [vaultId, accountId]
  );
  return (
    <div>
      <BreadCrumbs items={br} />
      <AccountInfo vaultId={vaultId} accountId={accountId} />
      <div className="h-8" /> {/* spacer */}
      <WalletList accountId={accountId} />
    </div>
  );
};

export default AccountWallets;
