import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { makeUserTokenVerifier } from "@whop/api";
import { whopSdk } from "app/lib/whop-sdk";

const verifyUserToken = makeUserTokenVerifier({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
});

export async function GET() {
  const headerList = await headers();
  const token = headerList.get("x-whop-user-token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const { userId } = await verifyUserToken(token);

    // ✅ Use the REST endpoint to fetch memberships
    const response = await fetch(`https://api.whop.com/api/v2/users/${userId}/memberships`, {
      headers: {
        Authorization: `Bearer ${process.env.WHOP_API_KEY!}`,
        "Content-Type": "application/json",
      },
    });

    const memberships = await response.json();

    // Get unique companies from memberships
    const companies = memberships.map((m: any) => m.company);

    return NextResponse.json({ companies });
  } catch (err) {
    console.error("Failed to fetch companies:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}