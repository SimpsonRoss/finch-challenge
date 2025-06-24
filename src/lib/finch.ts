import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * Finch API helper library
 *
 * Centralizes authentication (reads finch_token from cookies), API versioning,
 * and unified error handling for all Finch HTTP calls.
 *
 * Exports:
 *  - GET_Finch<T>:    wrapper for simple GET endpoints (e.g. /employer/company, /employer/directory)
 *  - POST_FinchBatch<T>: wrapper for batch‐style POST endpoints (e.g. /employer/individual, /employer/employment)
*/

interface FetchOptions {
  unsupported: string
  apiVersion?: string
}

async function fetchWithToken(
  path: string,
  init: RequestInit,
  unsupportedMsg: string,
  apiVersion = '2020-09-17'
) {
  const jar = await cookies()
  const token = jar.get('finch_token')?.value
  if (!token) {
    throw NextResponse.json(
      { error: 'Access token missing. Please authenticate.' },
      { status: 401 }
    )
  }

  const headers = {
    ...(init.headers || {}),
    Authorization: `Bearer ${token}`,
    'Finch-API-Version': apiVersion,
  }

  const res = await fetch(`https://api.tryfinch.com${path}`, {
    ...init,
    headers,
  })

  if (res.status === 501) {
    throw NextResponse.json({ error: unsupportedMsg }, { status: 501 })
  }
  if (!res.ok) {
    const text = await res.text()
    console.error(`Finch ${path} error (${res.status}):`, text)
    throw NextResponse.json(
      { error: `Error calling ${path}` },
      { status: 500 }
    )
  }

  const data = await res.json()
  if (!data || typeof data !== 'object') {
    throw new Response('Malformed response from Finch API', { status: 502 })
  }
  return data
}


// Single‐resource endpoints (/employer/company, /employer/directory)
export async function GET_Finch<T>(
  path: string,
  { unsupported, apiVersion }: FetchOptions
): Promise<T> {
  return await fetchWithToken(
    path,
    { method: 'GET' },
    unsupported,
    apiVersion
  ) as T
}

// Batch‐style endpoints (/employer/individual, /employer/employment)
export async function POST_FinchBatch<T>(
  path: string,
  body: unknown,
  { unsupported, apiVersion }: FetchOptions
): Promise<T> {
  const raw = await fetchWithToken(
    path,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    unsupported,
    apiVersion
  ) as { responses: Array<{ body: T }> }

  if (
    !Array.isArray(raw.responses) ||
    raw.responses.length === 0 ||
    raw.responses[0].body == null
  ) {
    throw new Response('Malformed batch response', { status: 502 })
  }

  return raw.responses[0].body
}
