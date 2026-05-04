import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Verify user authentication
  // TODO: Fetch from database filtered by user ID

  const maintenanceRequests = [
    {
      id: 'maint1',
      unit: '2A',
      tenant: 'R. Nguyen',
      title: 'Leaky faucet in kitchen',
      description: 'Kitchen sink is leaking underneath the cabinet',
      status: 'open',
      priority: 'medium',
      submittedDate: '2026-04-15',
      images: ['image1.jpg', 'image2.jpg'],
    },
    {
      id: 'maint2',
      unit: '3A',
      tenant: 'J. Patel',
      title: 'HVAC not working',
      description: 'Air conditioning is not turning on',
      status: 'in-progress',
      priority: 'high',
      submittedDate: '2026-04-10',
      assignedTo: 'John Smith',
      images: [],
    },
    {
      id: 'maint3',
      unit: '1B',
      tenant: 'T. Okonkwo',
      title: 'Door lock needs repair',
      description: 'Front door lock is sticking',
      status: 'completed',
      priority: 'low',
      submittedDate: '2026-04-05',
      completedDate: '2026-04-12',
    },
  ]

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
