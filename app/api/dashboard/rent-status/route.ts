import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Verify user authentication
  // TODO: Fetch from database filtered by user ID

  // Start with empty rent status - builds as landlord adds properties
  const rentStatus = {
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    totalUnits: 0,
    collectedUnits: 0,
    percentageCollected: 0,
    totalRentExpected: 0,
    totalRentCollected: 0,
    units: [],
  }

  return NextResponse.json(rentStatus)
}
