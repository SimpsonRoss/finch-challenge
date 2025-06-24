import { NextRequest } from 'next/server'
import DOMPurify from 'isomorphic-dompurify'

/**
 * API Route: POST /api/createLinkToken
 * Creates a Finch Connect session or reauthenticates an existing connection
 */

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const { customerId, customerName } = await request.json()
  if (!customerId || !customerName) {
    return new Response(
      JSON.stringify({ error: 'customerId and customerName are required' }),
      { status: 400 }
    )
  }

  const safeName = DOMPurify.sanitize(customerName, {
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: []
  }).trim()

  const authHeader = Buffer.from(
    `${process.env.FINCH_CLIENT_ID}:${process.env.FINCH_CLIENT_SECRET}`
  ).toString('base64')

  const headers = {
    'Content-Type':      'application/json',
    'Authorization':     `Basic ${authHeader}`,
    'Finch-API-Version': '2020-09-17',
  }

  const redirectUri = process.env.NEXT_PUBLIC_FINCH_REDIRECT_URI;
  if (!redirectUri) {
    throw new Error('Missing NEXT_PUBLIC_FINCH_REDIRECT_URI in environment variables');
  }

  // New connect session
  let res = await fetch('https://api.tryfinch.com/connect/sessions', {
    method:  'POST',
    headers,
    body: JSON.stringify({
      customer_id:         customerId,
      customer_name:       safeName,
      products:            ['company','directory','individual','employment'],
      authentication_type: 'oauth',
      redirect_uri:        redirectUri,
    }),
  })

  // If they already have a connection, reauthenticate instead
  if (res.status === 400) {
    const err = await res.json().catch(() => null)
    if (err?.finch_code === 'connection_already_exists') {
      const connectionId = err.context?.connection_id
      if (connectionId) {
        console.log('↻ Reauthenticating existing connection:', connectionId)
        res = await fetch(
          'https://api.tryfinch.com/connect/sessions/reauthenticate',
          {
            method:  'POST',
            headers,
            body: JSON.stringify({ 
              connection_id: connectionId,
              redirect_uri:  redirectUri,
              sandbox: 'finch'
            }),
          }
        )
      }
    }
  }


  if (!res.ok) {
    const errorText = await res.text()
    console.error(`Finch API error (${res.status}):`, errorText)
    return new Response(
      JSON.stringify({ error: 'Failed to (re)authenticate with Finch' }),
      { status: 500 }
    )
  }

  const { connect_url } = await res.json()
  return new Response(JSON.stringify({ connect_url }), { status: 200 })
}
