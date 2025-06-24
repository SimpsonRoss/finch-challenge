import { NextResponse } from 'next/server'
import { POST_FinchBatch } from '@/lib/finch'

/**
 * API Route: GET /api/individual/[id]
 * Fetches individual data from Finch API for a given individual ID
 */

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const individual = await POST_FinchBatch(
    '/employer/individual',
    { requests: [{ individual_id: id }] },
    { unsupported: 'This provider does not support individual data.' }
  )
  return NextResponse.json(individual)
}
