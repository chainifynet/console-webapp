import { Icon } from "@iconify/react";
import { OrgPlan, OrgSubscriptionStatus } from "../../../../types/types";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function SubscriptionCard(props: { data: SubscriptionDetails }) {
  const {
    planId,
    vaultCount,
    vaultMax,
    accountCount,
    accountMax,
    userCount,
    userMax,
    assets,
    policyManagement,
    reporting,
    cosignerOwnership,
    status,
    upgradable,
    price,
    upgradeLink,
  } = props.data;

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className="bg-base-300 py-1">
        <h2 className="card-title">{planId}</h2>
      </figure>
      <div className="card-body py-0">
        <div className="">
          <table className="table">
            <tbody>
              <ItemNumber label="Vaults" value={vaultCount} ofTotal={vaultMax} />
              <ItemNumber label="Accounts" value={accountCount} ofTotal={accountMax} />
              <ItemNumber label="Users" value={userCount} ofTotal={userMax} />
              {/* row */}
              <tr>
                <th className="pl-0 font-bold opacity-60">Assets</th>
                <td className="pr-0 text-right flex justify-end">
                  <div className="font-semibold whitespace-break-spaces">{assets}</div>
                </td>
              </tr>
              {/* row */}
              <ItemBool label="Policy Management" value={policyManagement} />
              <ItemBool label="Reporting" value={reporting} />
              <ItemBool label="Private Custody" value={cosignerOwnership} />
            </tbody>
          </table>
        </div>
      </div>
      {upgradable && planId !== OrgPlan.ENTERPRISE && (
        <div className="card-actions ">
          <a className="btn btn-primary w-full rounded-none rounded-b-xl" href={upgradeLink} target="_blank">
            <div className="flex flex-col space-y-1">
              <div className="">Upgrade</div>
              <div>
                {formatter.format(Number(price))} <span className="lowercase text-xs">&nbsp;per month</span>
              </div>
            </div>
          </a>
        </div>
      )}
      {upgradable && planId == OrgPlan.ENTERPRISE && (
        <div className="card-actions ">
          <a
            className="btn btn-primary w-full rounded-none rounded-b-xl"
            href="mailto:sales@chainify.net"
            target="_blank"
          >
            <div className="flex flex-col space-y-1">
              <div className="">Request Quote</div>
            </div>
          </a>
        </div>
      )}
      {status === OrgSubscriptionStatus.ACTIVE && planId !== OrgPlan.DEVELOPER && (
        <figure className="bg-success py-3  dark:text-black">
          <h2 className="opacity-60 font-semibold">Active</h2>
        </figure>
      )}
    </div>
  );
}

function ItemNumber({ label, value, ofTotal }: { label: string; value?: number; ofTotal: number | string }) {
  return (
    <tr>
      <th className="pl-0 font-bold opacity-60">{label}</th>
      <td className="pr-0 text-right flex justify-end">
        {value === undefined ? (
          <div>
            <span className="font-semibold text-lg">{ofTotal}</span>
          </div>
        ) : (
          <div>
            <span className="font-semibold text-lg">{value}</span>
            <span className="font-normal text-sm"> /{ofTotal}</span>
          </div>
        )}
      </td>
    </tr>
  );
}

function ItemBool({ label, value }: { label: string; value: boolean }) {
  return (
    <tr>
      <th className="pl-0 font-bold opacity-60">{label}</th>
      <td className="pr-0 text-right flex justify-end">
        {value ? (
          <div>
            <Icon icon="gg:check-o" className="h-5 w-5" />
          </div>
        ) : (
          <span className="opacity-40 font-semibold">N/A</span>
        )}
      </td>
    </tr>
  );
}

export interface SubscriptionDetails {
  planId: OrgPlan;
  vaultCount?: number;
  vaultMax: number | string;
  accountCount?: number;
  accountMax: number | string;
  userCount?: number;
  userMax: number | string;
  assets: string;
  policyManagement: boolean;
  reporting: boolean;
  cosignerOwnership: boolean;
  status: OrgSubscriptionStatus;
  upgradable: boolean;
  upgradeLink?: string;
  price: string;
}
