import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Verify user authentication
  // TODO: Fetch from database filtered by user ID

  const deposits = [
    {
      id: 'dep1',
      unit: '1A',
      tenant: 'M. Kowalski',
      amount: 1800,
      dateReceived: '2025-12-15',
      moveInDate: '2025-12-15',
      moveOutDate: null,
      status: 'held',
      returnDeadline: null,
    },
    {
      id: 'dep2',
      unit: '1B',
      tenant: 'T. Okonkwo',
      amount: 2100,
      dateReceived: '2025-11-01',
      moveInDate: '2025-11-01',
      moveOutDate: '2026-02-28',
      status: 'returned',
      returnDeadline: '2026-03-30',
      returnedDate: '2026-03-25',
      returnAmount: 2100,
    },
    {
      id: 'dep3',
      unit: '2A',
      tenant: 'R. Nguyen',
      amount: 1950,
      dateReceived: '2026-01-10',
      moveInDate: '2026-01-10',
      moveOutDate: null,
      status: 'held',
      returnDeadline: null,
    },
  ]

  return NextResponse.json(deposits)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { unitId, tenantId, amount, dateReceived } = body

    if (!unitId || !amount) {
      return NextResponse.json(
        { error: 'Unit ID and amount are required' },
        { status: 400 }
      )
    }

    // TODO: Create deposit record in database

    return NextResponse.json(
      {
        success: true,
        deposit: {
          id: 'new_dep_id',
          unitId,
          amount,
          dateReceived: dateReceived || new Date().toISOString(),
          status: 'held',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
