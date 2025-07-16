import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { whopSdk } from "app/lib/whop-sdk";

export async function GET() {
  const headersList = await headers();
  const token = headersList.get("x-whop-user-token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const { userId } = await whopSdk.verifyUserToken(headersList);

    const response = await fetch(`https://api.whop.com/api/v2/users/${userId}/memberships`, {
      headers: {
        Authorization: `Bearer ${process.env.WHOP_API_KEY!}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const companies = (data.memberships || [])
      .map((m: any) => m.company)
      .filter((company: any) => company?.id && company?.title);

    return NextResponse.json({ companies });
  } catch (err) {
    console.error("Company Fetch Error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}