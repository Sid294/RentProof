import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Verify tenant authentication
  // TODO: Fetch from database filtered by tenant ID

  const tenantPortal = {
    tenant: {
      id: 'tenant123',
      name: 'R. Nguyen',
      email: 'r.nguyen@email.com',
    },
    property: {
      id: 'prop1',
      address: '123 Main St, Indianapolis, IN',
    },
    unit: {
      id: 'unit2a',
      number: '2A',
      lease: {
        id: 'lease1',
        startDate: '2026-01-10',
        endDate: '2027-01-09',
        rentAmount: 1950,
        dueDate: 1,
      },
    },
    currentRent: {
      dueDate: '2026-05-01',
      amount: 1950,
      status: 'pending',
      paymentMethods: [
        { id: 'bank', name: 'Bank Transfer', enabled: true },
        { id: 'card', name: 'Credit/Debit Card', enabled: true },
      ],
    },
    documents: [
      {
        id: 'doc1',
        name: 'Lease Agreement',
        type: 'lease',
        uploadedDate: '2026-01-10',
      },
      {
        id: 'doc2',
        name: 'Move-in Photos',
        type: 'photo-walkthrough',
        uploadedDate: '2026-01-10',
      },
    ],
    maintenanceRequests: [
      {
        id: 'maint1',
        title: 'Leaky faucet in kitchen',
        status: 'open',
        submittedDate: '2026-04-15',
        priority: 'medium',
      },
    ],
  }

  return NextResponse.json(tenantPortal)
}
