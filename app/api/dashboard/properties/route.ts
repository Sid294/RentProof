import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Verify user authentication
  // TODO: Fetch from database filtered by user ID

  const mockProperties = [
    {
      id: 'prop1',
      address: '123 Main St',
      city: 'Indianapolis',
      state: 'IN',
      units: [
        {
          id: 'unit1a',
          name: '1A',
          tenant: 'M. Kowalski',
          rentAmount: 1800,
          status: 'paid',
          dueDate: '2026-04-01',
        },
        {
          id: 'unit1b',
          name: '1B',
          tenant: 'T. Okonkwo',
          rentAmount: 2100,
          status: 'paid',
          dueDate: '2026-04-01',
        },
      ],
    },
  ]

  return NextResponse.json(mockProperties)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, city, state, zipCode } = body

    if (!address || !city || !state) {
      return NextResponse.json(
        { error: 'Address, city, and state are required' },
        { status: 400 }
      )
    }

    // TODO: Create property in database

    return NextResponse.json(
      {
        success: true,
        property: {
          id: 'new_prop_id',
          address,
          city,
          state,
          zipCode,
          units: [],
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
