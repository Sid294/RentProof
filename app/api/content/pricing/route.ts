import { NextResponse } from 'next/server'

export async function GET() {
  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 19,
      annualPrice: 228,
      unitLimit: 5,
      description: 'Perfect for individual landlords',
      features: [
        'Rent tracking and payment status',
        'Automated rent reminders',
        'Maintenance request management',
        'Move-in photo documentation',
        'Lease and document storage',
        'Tenant portal (unlimited tenants)',
      ],
      cta: 'Start Free Trial',
      link: '/signup?plan=starter',
    },
    {
      id: 'growth',
      name: 'Growth',
      monthlyPrice: 59,
      annualPrice: 708,
      unitLimit: 25,
      description: 'Most popular plan',
      badge: 'Most popular',
      featured: true,
      features: [
        'Everything in Starter',
        'Late fee automation',
        'Deposit vault and deadline alerts',
        'One-click dispute evidence export',
        'In-app landlord-tenant messaging',
        'Move-out comparison reports',
        'Priority support',
        'Custom late fee rules',
        'Bulk tenant invites',
      ],
      cta: 'Start Free Trial',
      link: '/signup?plan=growth',
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 149,
      annualPrice: 1788,
      unitLimit: null,
      description: 'For professional property managers',
      features: [
        'Everything in Growth',
        'Unlimited units',
        'Team access and roles',
        'White-label tenant portal',
        'API access',
        'Maintenance vendor management',
        'Portfolio-level reporting',
        'Dedicated account manager',
        'SLA-backed support',
        'Custom onboarding',
      ],
      cta: 'Start Free Trial',
      link: '/signup?plan=pro',
    },
  ]

  return NextResponse.json(pricingPlans)
}
