import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const h = await headers();
  return NextResponse.json({
    whopUserId: h.get("whop-user-id"),
    allHeaders: Object.fromEntries(h.entries()),
  });
}