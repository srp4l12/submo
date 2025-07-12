// app/api/whop/companies/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-whop-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Missing Whop user ID in headers' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.whop.com/api/v2/users/${userId}/memberships`, {
      headers: {
        Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Whop API error:', result);
      return NextResponse.json({ error: result }, { status: response.status });
    }

    const joinedCompanies = result?.memberships?.map((m: any) => m.company) ?? [];

    return NextResponse.json({ companies: joinedCompanies }, { status: 200 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}