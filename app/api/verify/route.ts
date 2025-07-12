import { NextResponse } from 'next/server';
import supabase from 'app/lib/supabase/server'; // ✅ fixed import
import * as cheerio from 'cheerio'; // ✅ fixed import for ESM modules

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const code = formData.get('code') as string;
    const username = formData.get('username') as string;
    const platform = formData.get('platform') as string;

    if (!code || !username || !platform) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    let profileUrl = '';
    if (platform === 'TikTok') {
      profileUrl = `https://www.tiktok.com/@${username}`;
    } else if (platform === 'Instagram') {
      profileUrl = `https://www.instagram.com/${username}/`;
    } else if (platform === 'YouTube') {
      profileUrl = `https://www.youtube.com/@${username}`;
    } else {
      return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    const res = await fetch(profileUrl);
    const html = await res.text();
    const $ = cheerio.load(html);

    let found = false;

    if (platform === 'TikTok') {
      const bio = $('meta[name="description"]').attr('content') || '';
      found = bio.includes(code);
    } else if (platform === 'Instagram') {
      const bio = $('meta[property="og:description"]').attr('content') || '';
      found = bio.includes(code);
    } else if (platform === 'YouTube') {
      const description = $('meta[name="description"]').attr('content') || '';
      found = description.includes(code);
    }

    if (!found) {
      return NextResponse.json({ error: 'Verification code not found in bio' }, { status: 400 });
    }

    // ✅ Update Supabase record
    const { error } = await supabase
      .from('connected_accounts')
      .update({ verified: true })
      .eq('username', username)
      .eq('platform', platform)
      .eq('code', code);

    if (error) {
      console.error('Supabase update error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Error in verify route:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}