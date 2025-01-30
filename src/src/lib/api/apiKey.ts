import { ApiKey, CreateApiKeyRequest } from "../../../types/types";
import { apiUrl } from "../../constants";

export async function createApiKey(token: string, data: CreateApiKeyRequest): Promise<ApiKey> {
  const response = await fetch(`${apiUrl}/apikeys`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw await toError("Failed to create api key", response);
  }
  const res = await response.json();
  return res.data.apikey;
}

export async function updateApiKey(
  token: string,
  apiKeyId: string,
  data: Partial<CreateApiKeyRequest>
): Promise<ApiKey> {
  const response = await fetch(`${apiUrl}/apikeys/${apiKeyId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw await toError("Failed to update api key", response);
  }
  const res = await response.json();
  return res.data.apikey;
}

export async function deleteApiKey(token: string, apiKeyId: string): Promise<ApiKey> {
  const response = await fetch(`${apiUrl}/apikeys/${apiKeyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw await toError("Failed to delete api key", response);
  }
  const res = await response.json();
  return res.data.deleted;
}

async function toError(prefix: string, resp: Response): Promise<Error> {
  const body = await resp.json().catch(() => ({ error: resp.statusText }));
  if (resp.status === 400) {
    return parse400(prefix, body);
  }
  return new Error(`${prefix}: ${body?.error}`);
}

function parse400(prefix: string, body: any): Error {
  const validationErrs = body?.error?.data?.validation?.errors;
  if (validationErrs && typeof validationErrs === "object") {
    return new Error(prefix + ": " + JSON.stringify(validationErrs));
  }
  return new Error(`${prefix}: ${body?.error}`);
}
