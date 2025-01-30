import type { User } from "@auth0/auth0-react";
import jwt_decode from "jwt-decode";
import { CurrentUser, OnboardingStage } from "../../../types/types";

export const getCurrentOrgData = (data: CurrentUser | null): string | null => {
  if (!data?.orgId) return null;
  const org = data?.orgs?.find((org) => org.orgId === data.orgId);
  return org?.tenant || null;
};

export const getScopes = (user?: User): string => {
  return user?.["https://auth.chainify.net/accessScopes"] || "";
};

export const getOnboardingStage = (user?: User): OnboardingStage | undefined => {
  return user?.["https://auth.chainify.net/onboardingStage"];
};

export const isOnboarding = (user?: User): OnboardingStage | undefined => {
  const roles = user?.["https://auth.chainify.net/userRoles"] || [];
  return roles.includes("ONBOARDING") || roles.includes("ORG_ONBOARDING");
};

export const hasScope = (scope: Scope, user?: User) => {
  return user?.["https://auth.chainify.net/accessScopes"]?.split(" ")?.includes(scope);
};

export const hasAnyOfScopes = (scopes: Scope[], user?: User) => {
  for (const scope of scopes) {
    if (hasScope(scope, user)) {
      return true;
    }
  }
  return false;
};

export function parseJwtScopes(token: string): string[] {
  try {
    const decoded = <any>jwt_decode(token);
    return toList(decoded?.["scope"]);
  } catch (error) {
    console.error("Error parsing JWT payload:", error);
    return [];
  }
}

function toList(val: string): string[] {
  if (!val) return [];
  return val.split(" ");
}

// TODO! update those when done
export enum Scope {
  ReadReports = "read:org_report",
  ReadWallets = "read:org_wallet",
  WriteWallets = "create:org_wallet",
  WriteAccounts = "create:org_account",
  WriteVaults = "create:org_vault",
  WriteTransactions = "write:org_transaction",
  ReadOrgUsers = "read:org_user",
  DeleteOrgUsers = "delete:org_user",
  UpdateOrgUsers = "update:org_user",
  ReadSubscription = "read:org_subscription",
  ReadOrgApiKey = "read:org_apikey",
  WriteOrgApiKey = "write:org_apikey",

  // onboarding
  WriteUserSignUp = "write:user_signup",
  WriteUserAcceptOrgInvite = "write:user_accept_org_invite",
  CreateOrg = "create:org",
  CreateOrgAccount = "create:org_account",
  CreateOrgUserInvite = "create:org_user_invite",
}
