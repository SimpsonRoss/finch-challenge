import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * API Route: GET /api/company
 * Fetches company data from Finch API for the authenticated user
 */

export async function GET() {
  const token = (await cookies()).get('finch_token')?.value;

  if (!token) {
    return new Response('Access token missing. Please authenticate.', { status: 401 });
  }

  const res = await fetch('https://api.tryfinch.com/employer/company', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Finch-API-Version': '2020-09-17',
    },
  });

  if (res.status === 501) {
    return NextResponse.json(
      { error: 'This provider does not support company data.' },
      { status: 501 }
    );
  }

  if (!res.ok) {
    const error = await res.text();
    console.error(`Finch /company error (${res.status}):`, error);
    return new Response('Error fetching company data.', { status: 500 });
  }

  const data = await res.json();
  if (!data || typeof data !== 'object') {
    return new Response('Malformed company data from Finch API.', { status: 502 });
  }
  console.log('Company data:', JSON.stringify(data));
  return new Response(JSON.stringify(data), { status: 200 });
}
