import { NextResponse } from 'next/server'

export async function GET() {
  const testimonials = [
    {
      id: 1,
      quote: 'My tenant contested the full deposit after move-out. I had timestamped photos of every room from day one. The case was closed in my favor in under two weeks. Without RentProof, I would have lost $3,000.',
      author: 'David K.',
      role: 'Landlord -- 4 units -- Indianapolis, IN',
      category: 'deposit-dispute',
    },
    {
      id: 2,
      quote: 'I used to spend three days every month tracking who paid and texting late tenants. Now it is fully automated. My tenants get reminded, late fees apply automatically, and I check a dashboard instead of a spreadsheet.',
      author: 'Patricia L.',
      role: 'Landlord -- 12 units -- Austin, TX',
      category: 'rent-tracking',
    },
    {
      id: 3,
      quote: 'We switched from a legacy PM system that cost $300 a month and did half of what RentProof does. The maintenance tracking alone saved us from two tenant escalations last quarter. This is what the software should have been ten years ago.',
      author: 'Marcus R.',
      role: 'Property Manager -- 40 units -- Philadelphia, PA',
      category: 'maintenance',
    },
  ]

  return NextResponse.json(testimonials)
}
