import { NextResponse } from 'next/server'
import { POST_FinchBatch } from '@/lib/finch'

/**
 * API Route: GET /api/employment/[id]
 * Fetches employment data from Finch API for a given individual ID
 */

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const employment = await POST_FinchBatch(
    '/employer/employment',
    { requests: [{ individual_id: id }] },
    { unsupported: 'This provider does not support employment data.' }
  )
  return NextResponse.json(employment)
}
