import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Verify user authentication
  // TODO: Fetch from database filtered by user ID

  // Start with empty list - tenants submit maintenance requests
  const maintenanceRequests = []

  return NextResponse.json(maintenanceRequests)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { unitId, title, description, priority, images } = body

    if (!unitId || !title) {
      return NextResponse.json(
        { error: 'Unit ID and title are required' },
        { status: 400 }
      )
    }

    // TODO: Create maintenance request in database

    return NextResponse.json(
      {
        success: true,
        request: {
          id: 'new_maint_id',
          unitId,
          title,
          description,
          priority: priority || 'medium',
          status: 'open',
          submittedDate: new Date().toISOString(),
          images: images || [],
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
