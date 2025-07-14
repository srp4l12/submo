// app/api/connect/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET all connected accounts (for testing — later we’ll filter by logged-in user)
export async function GET() {
  try {
    console.log('Fetching all connected accounts...');

    const { data, error } = await supabase
      .from('connected_accounts')
      .select('*'); // returns all rows (no filter for now)

    if (error) {
      console.error('Supabase GET error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ accounts: data ?? [] });
  } catch (err: any) {
    console.error('Unexpected GET error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST a new connected account
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, username, profile_link } = body;

    if (!platform || !username || !profile_link) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // ✅ clean 6-char uppercase code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await supabase.from('connected_accounts').insert([
      {
        user_id: 'admin', // still static for now
        platform,
        username,
        profile_link,
        code,
        verified: false,
      },
    ]).select().single();

    if (error) {
      console.error('Supabase POST error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ account: data });
  } catch (err: any) {
    console.error('Unexpected POST error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  
	}

}