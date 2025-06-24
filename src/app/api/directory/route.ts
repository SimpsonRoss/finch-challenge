import { GET_Finch } from '@/lib/finch'
import { NextResponse } from 'next/server'

/**
 * API Route: GET /api/directory
 * Fetches directory data from Finch API for the authenticated user
 */

export async function GET() {
  const directory = await GET_Finch('/employer/directory', {
    unsupported: 'This provider does not support directory data.',
  })
  return NextResponse.json(directory)
}