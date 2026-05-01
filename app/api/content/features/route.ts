import { NextResponse } from 'next/server'

export async function GET() {
  const features = [
    {
      id: 'rent-tracking',
      tag: 'Rent tracking',
      title: 'Payment status at a glance',
      description: 'See every unit\'s payment status in real time. Paid, late, partial -- all on one screen. No calls, no spreadsheet updates, no guessing.',
      icon: 'chart-dots',
    },
    {
      id: 'move-in-docs',
      tag: 'Move-in documentation',
      title: 'Timestamped, locked, permanent',
      description: 'Tenants complete a guided photo walkthrough on day one. Every image is timestamped and locked -- it cannot be edited or deleted by anyone.',
      icon: 'calendar',
    },
    {
      id: 'maintenance',
      tag: 'Maintenance management',
      title: 'Submitted, tracked, resolved',
      description: 'Tenants submit maintenance requests with photos directly in the app. You assign, update, and close them. Every action is logged with a timestamp.',
      icon: 'wrench',
    },
    {
      id: 'deposit-vault',
      tag: 'Deposit vault',
      title: 'Protected from the day they move in',
      description: 'Track deposit amounts and legal return deadlines for every unit. One click generates a complete dispute evidence package if it ever goes to court.',
      icon: 'lock',
    },
    {
      id: 'document-storage',
      tag: 'Lease and document storage',
      title: 'Every document in one place',
      description: 'Upload leases, notices, addendums, and signed agreements. Both parties always have access. Nothing gets lost in an email thread.',
      icon: 'file',
    },
    {
      id: 'messaging',
      tag: 'In-app messaging',
      title: 'Every conversation on record',
      description: 'Every landlord-tenant exchange is timestamped, logged, and stored. No more lost texts. No more "you never told me." The record speaks for itself.',
      icon: 'message',
    },
  ]

  return NextResponse.json(features)
}
