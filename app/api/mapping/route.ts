import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET all mappings for this user (optional, useful for debugging)
export async function GET() {
  const headersList = await headers();
  const userId = headersList.get("whop-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("account_whop_mappings")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ mappings: data }, { status: 200 });
}

// POST: Save a mapping between connected account and creator whop
export async function POST(req: Request) {
  const headersList = await headers();
  const userId = headersList.get("whop-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { connected_account_id, whop_company_id } = await req.json();

  if (!connected_account_id || !whop_company_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase.from("account_whop_mappings").insert({
    user_id: userId,
    connected_account_id,
    whop_company_id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}