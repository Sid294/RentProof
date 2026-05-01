import { NextResponse } from 'next/server'

export async function GET() {
  const stats = [
    {
      id: 1,
      number: '$3.2B',
      label: 'in security deposits wrongfully withheld each year in the US',
      icon: 'dollar',
    },
    {
      id: 2,
      number: '42%',
      label: 'of landlords have faced a payment dispute with a tenant',
      icon: 'chart',
    },
    {
      id: 3,
      number: '6x',
      label: 'faster dispute resolution for RentProof users vs. the average',
      icon: 'lightning',
    },
  ]

  return NextResponse.json(stats)
}
