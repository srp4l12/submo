import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getWhopUserId } from "app/lib/getWhopUser";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const userId = await getWhopUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { connected_account_id, whop_company_id } = await req.json();

    if (!connected_account_id || !whop_company_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("account_whop_mappings")
      .insert([
        {
          user_id: userId,
          connected_account_id,
          whop_company_id,
        },
      ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}