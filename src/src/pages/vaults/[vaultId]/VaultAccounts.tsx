import BreadCrumbs from "../../../components/BreadCrumbs";
import AccountList from "./AccountList";
import VaultInfo from "./VaultInfo";

const breadcrumbs = [
  {
    label: "Vaults",
    link: "/vaults",
  },
];

const VaultAccounts: React.FC = () => {
  return (
    <div>
      <BreadCrumbs items={breadcrumbs} />
      <VaultInfo />
      <div className="h-8" /> {/* spacer */}
      <AccountList />
    </div>
  );
};

export default VaultAccounts;
