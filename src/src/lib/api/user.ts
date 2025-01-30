import { CurrentUser, OnboadingUser, UserOrgResponse, UserResponse } from "../../../types/types";
import { apiUrl } from "../../constants";

export async function postUserOnboarding(token: string, firstname: string, lastname: string): Promise<OnboadingUser> {
  const response = await fetch(`${apiUrl}/auth/users/onboarding`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstname, lastname }),
  });
  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error("Failed to onboard profile: " + msg);
  }
  const res = await response.json();
  return res?.data?.user;
}

export async function postOrgOnboarding(token: string, name: string, tenant: string): Promise<UserOrgResponse> {
  const response = await fetch(`${apiUrl}/orgs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, tenant }),
  });
  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error("Failed onboard tenant: " + msg);
  }
  const res = await response.json();
  return res?.data?.org;
}

export async function getCurrentUser(token: string): Promise<CurrentUser> {
  const response = await fetch(`${apiUrl}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error("Failed to get current user: " + msg);
  }
  const res = await response.json();
  return res?.data;
}

export async function updateUserProfile(
  token: string,
  body: { firstname: string; lastname: string }
): Promise<UserResponse> {
  const response = await fetch(`${apiUrl}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error("Failed to update current user: " + msg);
  }
  const res = await response.json();
  return res?.data?.user;
}

export async function sendInvite(token: string, body: { email: string; orgRole: string }): Promise<boolean> {
  const response = await fetch(`${apiUrl}/orgs/users/invite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error("Failed to send invite: " + msg);
  }
  const res = await response.json();
  return res?.data?.created === true;
}

export async function updateUser(token: string, userId: string, body: { orgRole: string }): Promise<boolean> {
  const response = await fetch(`${apiUrl}/orgs/users/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error("Failed to send invite: " + msg);
  }
  const res = await response.json();
  return res?.data?.created === true;
}

export async function deleteUser(token: string, userId: string): Promise<boolean> {
  const response = await fetch(`${apiUrl}/orgs/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error("Failed to send invite: " + msg);
  }
  return true;
}

export async function acceptInvite(token: string, body: { orgId: string }): Promise<boolean> {
  const response = await fetch(`${apiUrl}/users/orgs/accept-invite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error("Failed to accept invite: " + msg);
  }
  const res = await response.json();
  return res?.data?.accepted === true;
}

async function parseError(resp: Response) {
  const body = await resp.json().catch(() => ({ error: { message: resp.statusText } }));
  return body?.error?.message;
}
