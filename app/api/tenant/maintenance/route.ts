import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, unitId, title, description, priority, images } = body

    if (!tenantId || !unitId || !title) {
      return NextResponse.json(
        { error: 'Tenant ID, unit ID, and title are required' },
        { status: 400 }
      )
    }

    // TODO: Create maintenance request in database
    // TODO: Notify landlord
    // TODO: Store images with timestamps

    return NextResponse.json(
      {
        success: true,
        request: {
          id: 'maint_req_id',
          tenantId,
          unitId,
          title,
          description,
          priority: priority || 'medium',
          status: 'open',
          submittedDate: new Date().toISOString(),
          images: images || [],
        },
        message: 'Maintenance request submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit maintenance request' },
      { status: 500 }
    )
  }
}
