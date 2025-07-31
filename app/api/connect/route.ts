import { whopSdk } from "app/lib/whop-sdk"; // ✅ adjust path if needed
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Fetch connected accounts
export async function GET() {
  const headersList = await headers();
  const { userId } = await whopSdk.verifyUserToken(headersList); // ✅ verified user

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("connected_accounts")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ accounts: data }, { status: 200 });
}

// POST: Add a new connected account
export async function POST(req: Request) {
  const headersList = await headers();
  const { userId } = await whopSdk.verifyUserToken(headersList); // ✅ verified user

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { platform, username, profile_link } = body;

  if (!platform || !username || !profile_link) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { error } = await supabase.from("connected_accounts").insert([
    {
      user_id: userId,
      platform,
      username,
      profile_link,
      code,
      verified: false,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Account submitted!" }, { status: 200 });
}