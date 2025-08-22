import type { Session } from "@supabase/supabase-js";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

function requireOk(res: Response): Response {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res;
}

function authHeaders(session: Session) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  } as const;
}

export async function createPlaidLinkToken(session: Session): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/plaid/create-link-token`, {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify({}),
  }).then(requireOk);
  const data = (await res.json()) as { linkToken: string };
  return data.linkToken;
}

export async function exchangePublicToken(
  session: Session,
  params: { publicToken: string; accountId: string; institutionName: string }
): Promise<void> {
  await fetch(`${API_BASE_URL}/api/plaid/exchange-public-token`, {
    method: "POST",
    headers: authHeaders(session),
    body: JSON.stringify(params),
  }).then(requireOk);
}


