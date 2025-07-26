import { headers } from "next/headers";

// Helper to decode JWT
function parseJwt(token: string): { sub?: string } | null {
  try {
    const base64Payload = token.split(".")[1];
    const payload = Buffer.from(base64Payload, "base64").toString("utf-8");
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

export async function getWhopUserId(): Promise<string | null> {
  const h = await headers();

  // Try header first
  const headerUserId = h.get("whop-user-id");
  if (headerUserId) return headerUserId;

  // Fallback to token
  const token = h.get("x-whop-user-token");
  if (!token) return null;

  const parsed = parseJwt(token);
  return parsed?.sub ?? null;
}