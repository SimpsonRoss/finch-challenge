import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * API Route: GET /api/directory
 * Fetches directory data from Finch API for the authenticated user
 */

export async function GET() {
  const token = (await cookies()).get('finch_token')?.value;

  if (!token) {
    return new Response('Access token missing. Please authenticate.', { status: 401 });
  }

  const res = await fetch('https://api.tryfinch.com/employer/directory', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Finch-API-Version': '2020-09-17',
    },
  });

  if (res.status === 501) {
    return NextResponse.json(
      { error: 'This provider does not support directory data.' },
      { status: 501 }
    );
  }
  
  if (!res.ok) {
    const error = await res.text();
    console.error(`Finch /directory error (${res.status}):`, error);
    return new Response('Error fetching directory data.', { status: 500 });
  }

  const data = await res.json();
  if (!data || typeof data !== 'object') {
    return new Response('Malformed directory data from Finch API.', { status: 502 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}
