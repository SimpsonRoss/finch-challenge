import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * API Route: GET /api/employment/[id]
 * Fetches employment data from Finch API for a given individual ID
 */

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const jar = await cookies();
  const token = jar.get('finch_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch('https://api.tryfinch.com/employer/employment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Finch-API-Version': '2020-09-17',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      requests: [{ individual_id: id }],
    }),
  });

  if (res.status === 501) {
    return NextResponse.json(
      { error: 'This provider does not support employment data.' },
      { status: 501 }
    );
  }
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Finch /employment error (${res.status}):`, errorText);
    return NextResponse.json({ error: 'Failed to fetch employment' }, { status: 500 });
  }

  const { responses } = await res.json();
  if (!responses || !responses[0] || !responses[0].body) {
    return NextResponse.json({ error: 'Malformed response from Finch API' }, { status: 502 });
  }
  return NextResponse.json(responses[0].body);
}
