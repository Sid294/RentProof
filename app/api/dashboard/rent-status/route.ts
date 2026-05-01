import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Verify user authentication
  // TODO: Fetch from database filtered by user ID

  const rentStatus = {
    month: 'April 2026',
    totalUnits: 6,
    collectedUnits: 4,
    percentageCollected: 67,
    totalRentExpected: 11800,
    totalRentCollected: 7450,
    units: [
      {
        id: 'unit1a',
        unit: '1A',
        tenant: 'M. Kowalski',
        amount: 1800,
        status: 'paid',
        paidDate: '2026-03-31',
      },
      {
        id: 'unit1b',
        unit: '1B',
        tenant: 'T. Okonkwo',
        amount: 2100,
        status: 'paid',
        paidDate: '2026-04-01',
      },
      {
        id: 'unit2a',
        unit: '2A',
        tenant: 'R. Nguyen',
        amount: 1950,
        status: 'pending',
        dueDate: '2026-04-01',
      },
      {
        id: 'unit2b',
        unit: '2B',
        tenant: 'S. Martinez',
        amount: 1650,
        status: 'paid',
        paidDate: '2026-04-02',
      },
      {
        id: 'unit3a',
        unit: '3A',
        tenant: 'J. Patel',
        amount: 2400,
        status: 'late',
        daysLate: 3,
        dueDate: '2026-03-30',
      },
      {
        id: 'unit3b',
        unit: '3B',
        tenant: 'C. Williams',
        amount: 1900,
        status: 'paid',
        paidDate: '2026-03-31',
      },
    ],
  }

  return NextResponse.json(rentStatus)
}
