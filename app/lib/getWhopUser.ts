import { cookies } from "next/headers";

export async function getWhopUserId(): Promise<string | null> {
  const cookieStore = await cookies(); // ✅ await it
  const userId = cookieStore.get("whop-user-id")?.value;

  return userId || null;
}