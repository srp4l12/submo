import { NextResponse } from "next/server";
import supabase from "app/lib/supabase/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const code = formData.get("code") as string;
    const username = formData.get("username") as string;
    const platform = formData.get("platform") as string;

    if (!code || !username || !platform) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let profileUrl = "";
    const cleanUsername = username.replace(/\/$/, "").split("?")[0];

    if (platform === "TikTok") {
      profileUrl = `https://www.tiktok.com/@${cleanUsername}`;
    } else if (platform === "Instagram") {
      profileUrl = `https://www.instagram.com/${cleanUsername}/`;
    } else if (platform === "YouTube") {
      profileUrl = `https://www.youtube.com/@${cleanUsername}`;
    } else {
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
    }

    const res = await fetch(profileUrl);
    const html = await res.text();
    const $ = cheerio.load(html);

    let found = false;

    if (platform === "TikTok") {
      const bio = $('meta[name="description"]').attr("content") || "";
      console.log("Fetched TikTok bio:", bio);
      found = bio.includes(code);
    } else if (platform === "Instagram") {
      const bio = $('meta[property="og:description"]').attr("content") || "";
      console.log("Fetched Instagram bio:", bio);
      found = bio.includes(code);
    } else if (platform === "YouTube") {
      const match = html.match(/"description":"(.*?)"/);
      const bio = match ? match[1] : "";
      console.log("Fetched YouTube bio:", bio);
      found = bio.includes(code);
    }

    if (!found) {
      return NextResponse.json(
        { error: "Verification code not found in bio" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("connected_accounts")
      .update({ verified: true })
      .eq("username", username)
      .eq("platform", platform)
      .eq("code", code);

    if (error) {
      console.error("Supabase update error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Error in verify route:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}