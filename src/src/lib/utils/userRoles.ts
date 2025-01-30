import { User } from "@auth0/auth0-react";

export type { Auth0ContextInterface } from "@auth0/auth0-react";

const orgRoleScopes: Record<string, string[]> = {
  OWNER: [
    "create:org_account",
    "create:org_user_invite",
    "create:org_vault",
    "create:org_wallet",
    "read:org_account",
    "read:org_gasstation",
    "read:org_report",
    "read:org_transaction",
    "read:org_user",
    "read:org_vault",
    "read:org_wallet",
    "update:org_user",
    "write:org_transaction",
  ],
  ADMIN: [
    "create:org_account",
    "create:org_vault",
    "create:org_wallet",
    "read:org_account",
    "read:org_gasstation",
    "read:org_report",
    "read:org_transaction",
    "read:org_vault",
    "read:org_wallet",
    "write:org_transaction",
  ],
  SPENDER: [
    "read:org_account",
    "read:org_gasstation",
    "read:org_transaction",
    "read:org_vault",
    "read:org_wallet",
    "write:org_transaction",
  ],
  REPORTER: [
    "read:org_account",
    "read:org_gasstation",
    "read:org_report",
    "read:org_transaction",
    "read:org_vault",
    "read:org_wallet",
  ],
  // prettier-ignore
  VIEW: [
    "read:org_account",
    "read:org_gasstation",
    "read:org_transaction",
    "read:org_vault",
    "read:org_wallet",
  ],
};

const userRoleScopes: Record<string, string[]> = {
  // prettier-ignore
  BASIC: [
    "read:org",
    "read:user",
    "read:user_org_invite",
    "update:user",
    "write:user_accept_org_invite",
  ],
  // prettier-ignore
  ONBOARDING: [
    "read:user",
    "write:user_signup",
  ],
  // prettier-ignore
  ORG_ONBOARDING: [
    "create:org",
  ],
};

/**
 * Gets the scopes for API calls from the current id token
 * @param user
 * @returns a string of scopes separated by spaces
 */
export function getScopesFromIdToken(user?: User): string {
  return user?.["https://auth.chainify.net/accessScopes"] || "";
}

/**
 * Gets the scopes for API calls from the db user
 * @param user
 * @returns a string of scopes separated by spaces
 */
export function getScopesFromDbUser(user: DbUser): string {
  if (!user) return "";

  const scopes = new Set<string>();
  // Add scopes for the user's roles
  for (const role of user.roles) {
    userRoleScopes[role].forEach((scope) => scopes.add(scope));
  }
  // Add scopes for the default org
  const userDefaultOrgRoles = <string[]>user[`org_${user.defaultOrg}`] || [];
  for (const role of userDefaultOrgRoles) {
    orgRoleScopes[role].forEach((scope) => scopes.add(scope));
  }
  const sortedScopes = Array.from(scopes).sort();
  return sortedScopes.join(" ");
}

type DbUser = {
  userId: string;
  onboardingComplete: boolean;
  onboardingStage: string;
  roles: string[];
  createdOrg: boolean;
  defaultOrg: string;
  [key: string]: string[] | boolean | string; // index signature to allow for dynamic org properties
};
