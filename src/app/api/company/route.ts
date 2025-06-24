import { GET_Finch } from '@/lib/finch'
import { NextResponse } from 'next/server'

/**
 * API Route: GET /api/company
 * Fetches company data from Finch API for the authenticated user
 */

export async function GET() {
  const company = await GET_Finch('/employer/company', {
    unsupported: 'This provider does not support company data.',
  })
  return NextResponse.json(company)
}
