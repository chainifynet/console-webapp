export type Wallet = {
  vaultId: string;
  walletId: string;
  accountId?: string;
  address: string;
  assetId: string;
  balance: string;
  createdAt: string;
  name?: string;
};

export const enum TxType {
  USER_SEND = "USER_SEND",
  USER = "USER",
  SWEEP = "SWEEP",
  REFUEL = "REFUEL",
  RECEIVE = "RECEIVE",
  FEE_FOR_TOKEN_SEND = "FEE_FOR_TOKEN_SEND",
}

export type Tx = {
  orgId: string;
  vaultId: string;
  walletId: string;
  txId: string;
  txHash: string;
  status: string;
  direction: "IN" | "OUT";
  from: string;
  to: string;
  amount: number;
  assetId: string;
  note: string;
  externalId: string;
  createdAt: string;
  updatedAt: string;
  type: TxType;
  timestamp?: string;
  expiration?: string;
  confirmations?: number;
  minerFee?: number;
  amountUsd?: number;
  minerFeeUsd?: number;
};

export type Vault = {
  vaultId: string;
  name: string;
  status: string;
  createdAt: string;
  walletId?: string;
  assetId?: string;
};

export type Account = {
  accountId: string;
  name: string;
  vaultId: string;
  createdAt: string;
  updatedAt: string;
  externalId?: string;
};

export type GasStation = {
  gasCap: string;
  gasThreshold: string;
  assetId: string;
  address: string;
  balance?: string;
};

// ==============================
// user management
// ==============================

export interface OrgUserResponse {
  userId: string;
  userEmail: string;
  orgRoles: OrgRoleGroup[];
  orgUserStatus: OrgUserStatus;
  createdAt: string;
  updatedAt: string;
}

export enum OrgRoleGroup {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  SPENDER = "SPENDER",
  REPORTER = "REPORTER",
  VIEW = "VIEW",
}

export const enum OrgUserStatus {
  ACTIVE = "ACTIVE",
  INVITED = "INVITED",
}

export const enum OrgTenancy {
  DEFAULT = "DEFAULT",
  DEDICATED = "DEDICATED",
}

export enum OrgPlan {
  DEVELOPER = "DEVELOPER",
  STARTUP = "STARTUP",
  BUSINESS = "BUSINESS",
  ENTERPRISE = "ENTERPRISE",
}

export interface OrgResponse {
  orgId: string;
  tenant: string;
  name: string;
  tenancy: OrgTenancy;
}

export interface CurrentUser {
  user: UserResponse;
  orgs: UserOrgResponse[];
  orgId?: string;
  orgSubscription: OrgSubscriptionResponse;
}

export enum OrgSubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface PlanFeatures {
  maxVaultCount: number;
  maxAccountCount: number;
  maxUserCount: number;
}

export interface OrgSubscriptionResponse {
  planId: OrgPlan;
  orgId: string;
  status: OrgSubscriptionStatus;
  expiresAt?: string;
  features: PlanFeatures;
}

export interface UserResponse {
  userId: string;
  email: string;
  firstname?: string;
  lastname?: string;
  userRoles: UserRoleGroup[];
  onboardingStage: OnboardingStage;
  onboardingNext?: OnboardingStage;
}

export enum UserRoleGroup {
  BASIC = "BASIC",
  ONBOARDING = "ONBOARDING",
  ORG_ONBOARDING = "ORG_ONBOARDING",
}

export enum OnboardingStage {
  PROFILE = "PROFILE",
  TENANT_SETUP = "TENANT_SETUP",
  COMPLETE = "COMPLETE",
}

export interface UserOrgResponse {
  orgId: string;
  tenant: string;
  orgRoles: OrgRoleGroup[];
}

export interface OnboadingUser {
  userId: string;
  email: string;
  auth0Id: string;
  userRoles?: UserRoleGroup[];
  firstname?: string;
  lastname?: string;
}

export interface ApiKey {
  apiKeyId: string; // random to pass as userid header
  name: string;
  expiresAt: string;
  permissions: ApiKeyPermission[];
  allowedCidrs?: string[];
  secret?: string; // secret, only to be returned on creation!
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export enum ApiKeyPermission {
  SPENDER = "SPENDER",
  READ = "READ",
  CREATE_VAULT = "CREATE_VAULT",
  CREATE_WALLET = "CREATE_WALLET",
  CREATE_ACCOUNT = "CREATE_ACCOUNT",
}

export interface CreateApiKeyRequest {
  name: string;
  permissions: ApiKeyPermission[];
  allowedCidrs?: string[];
  expiresAt?: string;
}
