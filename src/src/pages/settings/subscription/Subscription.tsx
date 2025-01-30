import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OrgPlan, OrgSubscriptionStatus } from "../../../../types/types";
import { Watermark } from "../../../components/watermark/Watermark";
import { stripeBusinessLink, stripeStartupLink } from "../../../constants";
import { ComposedMetrics, Metric, useMetrics } from "../../../hooks/fetch/useMetrics";
import { Dispatch, RootState } from "../../../store";
import { SubscriptionCard, SubscriptionDetails } from "./SubscriptionCard";
import { useAuth0 } from "@auth0/auth0-react";
import { Scope, hasScope } from "../../../lib/utils/user";

export const Subscription = () => {
  const { user } = useAuth0();
  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<Dispatch>();
  const email = currentUser?.user?.email;
  const orgId = currentUser?.orgId;
  const orgSubscription = currentUser?.orgSubscription;
  const metrics = useMetrics();

  useEffect(() => {
    if (metrics?.error) {
      dispatch.errors.set(metrics.error);
    }
  }, [metrics.error]);

  if (!hasScope(Scope.ReadSubscription, user)) {
    return <Watermark text="No permission to view subscription, please contact the owner of the organization" />;
  }

  if (metrics.isLoading || metrics.error) {
    return (
      <>
        <div className="text-xl font-bold opacity-40 mb-6">Subscription</div>
        <Watermark text={metrics.isLoading ? "Loading..." : "Error loading"} />
      </>
    );
  }

  return (
    <>
      <div className="text-xl font-bold opacity-40 mb-6">Subscription</div>

      <div className="grid grid-cols-1 gap-6 xl:space-y-0 xl:grid-cols-3">
        <SubscriptionCard
          data={getActiveSubscriptionDetails(
            metrics?.data,
            orgSubscription?.planId,
            orgSubscription?.status,
            email,
            orgId
          )}
        />
        {orgSubscription?.planId === OrgPlan.DEVELOPER && (
          <>
            <SubscriptionCard
              data={getSubscriptionDetails(OrgPlan.STARTUP, OrgSubscriptionStatus.INACTIVE, email, orgId)}
            />
            <SubscriptionCard
              data={getSubscriptionDetails(OrgPlan.BUSINESS, OrgSubscriptionStatus.INACTIVE, email, orgId)}
            />
            <SubscriptionCard
              data={getSubscriptionDetails(OrgPlan.ENTERPRISE, OrgSubscriptionStatus.INACTIVE, email, orgId)}
            />
          </>
        )}
        {orgSubscription?.planId === OrgPlan.STARTUP && (
          <>
            <SubscriptionCard
              data={getSubscriptionDetails(OrgPlan.BUSINESS, OrgSubscriptionStatus.INACTIVE, email, orgId)}
            />
            <SubscriptionCard
              data={getSubscriptionDetails(OrgPlan.ENTERPRISE, OrgSubscriptionStatus.INACTIVE, email, orgId)}
            />
          </>
        )}
        {orgSubscription?.planId === OrgPlan.BUSINESS && (
          <>
            <SubscriptionCard
              data={getSubscriptionDetails(OrgPlan.ENTERPRISE, OrgSubscriptionStatus.INACTIVE, email, orgId)}
            />
          </>
        )}
      </div>
    </>
  );
};

function getActiveSubscriptionDetails(
  metrics: ComposedMetrics,
  planId?: OrgPlan,
  status?: OrgSubscriptionStatus,
  email?: string,
  orgId?: string
): SubscriptionDetails {
  const plan = planId || OrgPlan.DEVELOPER;
  return {
    planId: plan,
    status: status || OrgSubscriptionStatus.ACTIVE,

    accountCount: metrics?.[Metric.ACCOUNT_COUNT]?.count || 0,
    accountMax: getMax(Metric.ACCOUNT_COUNT, metrics),
    vaultCount: metrics?.[Metric.VAULT_COUNT]?.count || 0,
    vaultMax: getMax(Metric.VAULT_COUNT, metrics),
    userCount: metrics?.[Metric.USER_COUNT]?.count || 0,
    userMax: getMax(Metric.USER_COUNT, metrics),

    ...getPerPlan(plan, email, orgId),
    upgradable: false,
  };
}

function getSubscriptionDetails(
  planId?: OrgPlan,
  status?: OrgSubscriptionStatus,
  email?: string,
  orgId?: string
): SubscriptionDetails {
  const plan = planId || OrgPlan.DEVELOPER;
  return {
    planId: plan,
    status: status || OrgSubscriptionStatus.ACTIVE,
    ...getMaxPerPlan(plan),
    ...getPerPlan(plan, email, orgId),
  };
}

function getMax(key: Metric, metrics: ComposedMetrics): number | string {
  const metric = metrics[key];
  if (metric.max && metric.max > 0) {
    return metric.max;
  }
  return "∞";
}

function getMaxPerPlan(planId: OrgPlan): Pick<SubscriptionDetails, "accountMax" | "userMax" | "vaultMax"> {
  switch (planId) {
    case OrgPlan.DEVELOPER:
      return {
        accountMax: 10,
        vaultMax: 2,
        userMax: 2,
      };
    case OrgPlan.STARTUP:
      return {
        accountMax: 500,
        vaultMax: 10,
        userMax: 5,
      };
    case OrgPlan.BUSINESS:
      return {
        accountMax: "4k",
        vaultMax: 20,
        userMax: 15,
      };
    case OrgPlan.ENTERPRISE:
      return {
        accountMax: "∞",
        vaultMax: "∞",
        userMax: "∞",
      };
  }
}

function getPerPlan(
  planId: OrgPlan,
  email?: string,
  orgId?: string
): Pick<
  SubscriptionDetails,
  "assets" | "policyManagement" | "cosignerOwnership" | "reporting" | "upgradable" | "price" | "upgradeLink"
> {
  switch (planId) {
    case OrgPlan.DEVELOPER:
      return {
        assets: "ETH, TRX & USDT",
        policyManagement: false,
        cosignerOwnership: false,
        reporting: false,
        upgradable: false,
        price: "Free",
      };
    case OrgPlan.STARTUP:
      return {
        assets: "ETH, TRX & USDT",
        policyManagement: true,
        cosignerOwnership: false,
        reporting: false,
        upgradable: true,
        upgradeLink: getStripeLink(OrgPlan.STARTUP, email, orgId),
        price: "395",
      };
    case OrgPlan.BUSINESS:
      return {
        assets: "ETH, TRX, BSC, Polygon & Tokens",
        policyManagement: true,
        cosignerOwnership: true,
        reporting: true,
        upgradable: true,
        upgradeLink: getStripeLink(OrgPlan.BUSINESS, email, orgId),
        price: "3950",
      };
    case OrgPlan.ENTERPRISE:
      return {
        assets: "ETH, TRX, BSC, Polygon & Tokens",
        policyManagement: true,
        cosignerOwnership: true,
        reporting: true,
        upgradable: true,
        price: "0",
      };
    default:
      // same as DEVELOPER for now
      return {
        assets: "ETH, TRX & USDT",
        policyManagement: false,
        cosignerOwnership: false,
        reporting: false,
        upgradable: false,
        price: "Free",
      };
  }
}

function getStripeLink(planId: OrgPlan, email?: string, orgId?: string) {
  if (planId === OrgPlan.STARTUP) {
    return `${stripeStartupLink}?prefilled_email=${email}&client_reference_id=${orgId}`;
  }
  if (planId === OrgPlan.BUSINESS) {
    return `${stripeBusinessLink}?prefilled_email=${email}&client_reference_id=${orgId}`;
  }
}
