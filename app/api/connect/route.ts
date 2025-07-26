import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getWhopUserId } from "app/lib/getWhopUser";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Fetch connected accounts
export async function GET(req: NextRequest) {
  const userId = await getWhopUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("connected_accounts")
    .select("*")
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Save a new connected account
export async function POST(req: NextRequest) {
  const userId = await getWhopUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { platform, username, profile_link } = await req.json();
  if (!platform || !username || !profile_link) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase.from("connected_accounts").insert([
    {
      user_id: userId,
      platform,
      username,
      profile_link,
      code,
      verified: false
    }
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, code });
}