import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "app/lib/getWhopUser";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type MappingBody = {
  connected_account_id: string;
  whop_company_id: string;
};

export async function POST(req: Request) {
  try {
    const user_id = await getCurrentUserId();
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: MappingBody = await req.json();
    const { connected_account_id, whop_company_id } = body;

    if (!connected_account_id || !whop_company_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("account_whop_mappings")
      .insert([
        {
          user_id,
          connected_account_id,
          whop_company_id,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}