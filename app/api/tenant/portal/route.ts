import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Verify tenant authentication
  // TODO: Fetch from database filtered by tenant ID

  // Return empty portal structure - will be populated once landlord sets up tenant
  const tenantPortal = {
    tenant: null,
    property: null,
    unit: null,
    currentRent: null,
    documents: [],
    maintenanceRequests: [],
  }

  return NextResponse.json(tenantPortal)
}
