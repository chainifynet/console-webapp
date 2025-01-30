import { Account, Tx, Vault } from "../../../types/types";
import { apiUrl } from "../../constants";

export async function getWalletReport(
  token: string,
  vaultId: string,
  walletId: string,
  month: string
): Promise<{ transactions: Tx[] }> {
  const response = await fetch(`${apiUrl}/vaults/${vaultId}/wallets/${walletId}/txreport?month=${month}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw await toError("Failed to fetch report", response);
  }
  return response.json();
}

export async function createVault(token: string, name: string): Promise<Vault> {
  const response = await fetch(`${apiUrl}/vaults`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw await toError("Failed to create vault", response);
  }
  return response.json();
}

export async function createAccount(token: string, vaultId: string, name: string): Promise<Account> {
  const response = await fetch(`${apiUrl}/vaults/${vaultId}/accounts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw await toError("Failed to create account", response);
  }
  return response.json();
}

export async function createWallet(
  token: string,
  vaultId: string,
  accountId: string,
  assetId: string,
  name: string
): Promise<Vault> {
  const response = await fetch(`${apiUrl}/vaults/${vaultId}/wallets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, assetId, accountId }),
  });
  if (!response.ok) {
    throw await toError("Failed to create wallet", response);
  }
  return response.json();
}

export async function send(token: string, vaultId: string, walletId: string, params: SendParams): Promise<Tx> {
  const response = await fetch(`${apiUrl}/vaults/${vaultId}/wallets/${walletId}/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw await toError("Failed send", response);
  }
  return response.json();
}

interface SendParams {
  toAddress: string;
  assetId: string;
  amount: string;
  note?: string;
  externalId?: string;
}

async function toError(prefix: string, resp: Response): Promise<Error> {
  const body = await resp.json().catch(() => ({ error: resp.statusText }));
  return new Error(`${prefix}: ${body?.error}`);
}
