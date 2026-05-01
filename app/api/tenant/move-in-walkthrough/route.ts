import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Get walkthrough status for tenant

  const walkthrough = {
    id: 'walkthrough123',
    tenantId: 'tenant123',
    unitId: 'unit2a',
    status: 'not-started',
    startedDate: null,
    completedDate: null,
    rooms: [
      { id: 'room1', name: 'Living Room', status: 'pending', photos: [] },
      { id: 'room2', name: 'Kitchen', status: 'pending', photos: [] },
      { id: 'room3', name: 'Bedroom 1', status: 'pending', photos: [] },
      { id: 'room4', name: 'Bedroom 2', status: 'pending', photos: [] },
      { id: 'room5', name: 'Bathroom', status: 'pending', photos: [] },
    ],
    instructions: 'Take clear photos of the condition of each room. Capture any existing damage, stains, or wear.',
  }

  return NextResponse.json(walkthrough)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, unitId, roomId, photos } = body

    if (!tenantId || !unitId || !roomId) {
      return NextResponse.json(
        { error: 'Tenant ID, unit ID, and room ID are required' },
        { status: 400 }
      )
    }

    // TODO: Store photos with exact timestamps and lock them
    // TODO: Prevent modification/deletion of stored photos
    // TODO: Generate timestamped evidence certificate

    return NextResponse.json(
      {
        success: true,
        room: {
          id: roomId,
          tenantId,
          unitId,
          photoCount: photos?.length || 0,
          uploadedDate: new Date().toISOString(),
          locked: true,
          certificate: {
            timestamp: new Date().toISOString(),
            hash: 'sha256hash_placeholder',
            status: 'verified',
          },
        },
        message: 'Room photos submitted and locked successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit walkthrough photos' },
      { status: 500 }
    )
  }
}
