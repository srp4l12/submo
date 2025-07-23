import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Fetch connected accounts
export async function GET() {
  const headersList = await headers(); // ✅ FIXED: added await
  const userId = headersList.get("whop-user-id");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { data, error } = await supabase
    .from("connected_accounts")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ accounts: data }), { status: 200 });
}

// POST: Add a new connected account
export async function POST(req: Request) {
  const headersList = await headers(); // ✅ FIXED: added await
  const userId = headersList.get("whop-user-id");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { platform, username, profile_link } = body;

  const code = Math.random().toString(36).substring(2, 8);

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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "Account submitted!" }), {
    status: 200,
  });
}