import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { whopSdk } from "app/lib/whop-sdk";

export async function GET() {
  const headersList = await headers();
  const token = headersList.get("x-whop-user-token");

  console.log("🔥 [Companies API] x-whop-user-token:", token);

  if (!token) {
    console.warn("❌ Missing Whop user token");
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    // Decode the user ID from token
    const { userId } = await whopSdk.verifyUserToken(headersList);
    console.log("✅ Decoded userId:", userId);

    // Fetch memberships from Whop REST API
    const response = await fetch(`https://api.whop.com/api/v2/users/${userId}/memberships`, {
      headers: {
        Authorization: `Bearer ${process.env.WHOP_API_KEY!}`,
        "Content-Type": "application/json",
      },
    });

    const memberships = await response.json();
    console.log("📦 Raw memberships response:", memberships);

    if (!Array.isArray(memberships)) {
      throw new Error("Invalid memberships response");
    }

    // Extract valid companies
    const companies = memberships
      .map((m: any) => m.company)
      .filter((company: any) => company && company.id && company.title);

    console.log("🏢 Filtered companies:", companies);

    return NextResponse.json({ companies });
  } catch (err) {
    console.error("❌ Company Fetch Error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}