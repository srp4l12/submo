import { headers } from "next/headers";
import { makeUserTokenVerifier } from "@whop/api";

const verifyUserToken = makeUserTokenVerifier({
  appId: "app_abIot1wcjVWZ9L",
});

export async function getWhopUserId(): Promise<string | null> {
  const headersList = await headers();
  const token = headersList.get("x-whop-user-token");

  if (!token) return null;

  try {
    const { userId } = await verifyUserToken(headersList);
    return userId;
  } catch (err) {
    console.error("Whop token verification failed:", err);
    return null;
  }
}