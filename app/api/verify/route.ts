import { NextResponse } from "next/server";
import { whopSdk } from "app/lib/whop-sdk";
import { headers } from "next/headers";
import supabase from "app/lib/supabase/server";
import * as cheerio from "cheerio";

// Utility to clean username from full URL (esp. IG)
function extractUsername(platform: string, input: string): string {
  try {
    const url = new URL(input);
    if (platform === "Instagram") {
      return url.pathname.split("/").filter(Boolean)[0];
    }
    if (platform === "TikTok") {
      return url.pathname.split("@")[1] || input.replace(/^@/, "");
    }
    if (platform === "YouTube") {
      return url.pathname.split("@")[1] || input.replace(/^@/, "");
    }
  } catch {
    return input.replace(/^@/, "");
  }
  return input.replace(/^@/, "");
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const code = formData.get("code") as string;
    const rawUsername = formData.get("username") as string;
    const platform = formData.get("platform") as string;

    if (!code || !rawUsername || !platform) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ Fix the headers await
    const headersList = await headers();
    const { userId } = await whopSdk.verifyUserToken(headersList);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: No userId" }, { status: 401 });
    }

    const username = extractUsername(platform, rawUsername);

    let profileUrl = "";
    if (platform === "TikTok") {
      profileUrl = `https://www.tiktok.com/@${username}`;
    } else if (platform === "Instagram") {
      profileUrl = `https://www.instagram.com/${username}/`;
    } else if (platform === "YouTube") {
      profileUrl = `https://www.youtube.com/@${username}`;
    } else {
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
    }

    const res = await fetch(profileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      },
    });

    const html = await res.text();
    const $ = cheerio.load(html);
    let found = false;

    if (platform === "TikTok") {
      const scriptContent = $('script[id="SIGI_STATE"]').html();
      if (scriptContent) {
        try {
          const json = JSON.parse(scriptContent);
          const bio = json?.UserModule?.users?.[username]?.signature || "";
          console.log("TikTok bio:", bio);
          found = bio.includes(code);
        } catch (err) {
          console.error("Error parsing TikTok script:", err);
        }
      }
    } else if (platform === "Instagram") {
      // Debug: Log the response status and basic info
      console.log("Instagram response status:", res.status);
      console.log("HTML length:", html.length);
      
      // Try multiple methods to find Instagram bio
      let bio = "";
      
      // Method 1: Meta description
      const metaContent = $('meta[name="description"]').attr("content") || "";
      console.log("Method 1 - Meta description:", metaContent);
      
      // Method 2: Look for biography in page content (multiple patterns)
      const bioPatterns = [
        /"biography":"([^"]*?)"/,
        /"bio":"([^"]*?)"/,
        /"description":"([^"]*?)"/,
        /biography&quot;:&quot;([^&]*?)&quot;/,
        /bio&quot;:&quot;([^&]*?)&quot;/,
        /"full_name":"[^"]*","biography":"([^"]*?)"/
      ];
      
      for (let i = 0; i < bioPatterns.length; i++) {
        const match = html.match(bioPatterns[i]);
        if (match && match[1]) {
          bio = match[1];
          console.log(`Method 2.${i + 1} - Pattern ${i + 1} found:`, bio);
          break;
        }
      }
      
      // Method 3: Look in script tags for user data
      const scriptTags = $('script').not('[src]');
      console.log("Found", scriptTags.length, "inline script tags");
      
      scriptTags.each((i, el) => {
        if (bio) return; // Skip if we already found bio
        
        const scriptContent = $(el).html() || "";
        if (scriptContent.includes('biography') || scriptContent.includes('"bio"')) {
          console.log(`Script ${i} contains bio data`);
          
          // Try to extract from various script formats
          const scriptBioPatterns = [
            /"biography":"([^"]*?)"/,
            /"bio":"([^"]*?)"/,
            /biography&quot;:&quot;([^&]*?)&quot;/,
            /bio&quot;:&quot;([^&]*?)&quot;/
          ];
          
          for (const pattern of scriptBioPatterns) {
            const match = scriptContent.match(pattern);
            if (match && match[1]) {
              bio = match[1];
              console.log("Found bio in script:", bio);
              break;
            }
          }
        }
      });
      
      // Method 4: Search for any occurrence of the code in the entire HTML
      console.log("Searching entire HTML for code:", code);
      const codeFoundInHtml = html.toLowerCase().includes(code.toLowerCase());
      console.log("Code found anywhere in HTML:", codeFoundInHtml);
      
      // Use the best bio we found
      const finalBio = bio || metaContent;
      console.log("Final Instagram bio:", finalBio);
      console.log("Looking for code:", code);
      
      // Check both the bio and the entire HTML
      found = finalBio.toLowerCase().includes(code.toLowerCase()) || codeFoundInHtml;
      
    } else if (platform === "YouTube") {
      const match = html.match(/"description":"(.*?)"/);
      const bio = match ? match[1] : "";
      console.log("YouTube bio:", bio);
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
      .eq("user_id", userId)
      .eq("username", username)
      .eq("platform", platform)
      .eq("code", code);

    if (error) {
      console.error("Supabase update error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Verify Route Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}