import { cookies } from 'next/headers';   

/**
 * API Route: POST /api/token
 * Exchanges an authorization code for a Finch access token and stores it in a secure cookie
 */

export const runtime = 'nodejs';    
export async function POST(req: Request) {
  const { code } = await req.json();

  const url = 'https://api.tryfinch.com/auth/token';
  console.log('→ exchanging code at:', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Finch-API-Version': '2020-09-17',
    },
    body: JSON.stringify({
      client_id: process.env.FINCH_CLIENT_ID,
      client_secret: process.env.FINCH_CLIENT_SECRET,
      code,
      redirect_uri: process.env.NEXT_PUBLIC_FINCH_REDIRECT_URI!,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Token exchange failed (${response.status}):`, text);
    return new Response(JSON.stringify({ error: 'Token exchange failed' }), { status: 500 });
  }

  const { access_token } = await response.json();
  ;(await cookies()).set({
    name: 'finch_token',
    value: access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 3600,
    sameSite: 'lax',
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
