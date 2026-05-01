'use client'

import { useState } from 'react'
import Link from 'next/link'

type Mode = 'monthly' | 'annual'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 19,
    annual: 16,
    limit: 'Up to 5 units',
    featured: false,
    features: [
      'Rent tracking and payment status',
      'Automated rent reminders',
      'Maintenance request management',
      'Move-in photo documentation',
      'Lease and document storage',
      'Tenant portal (unlimited tenants)',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 59,
    annual: 49,
    limit: 'Up to 25 units',
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
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 149,
    annual: 124,
    limit: 'Unlimited units',
    featured: false,
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
  },
]

export default function Pricing() {
  const [mode, setMode] = useState<Mode>('monthly')

  return (
    <section className="section pricing-section" id="pricing">
      <div className="container">
        <div className="pricing-header">
          <div className="section-label fade-in" style={{ justifyContent: 'center' }}>Pricing</div>

          <h2 className="pricing-headline fade-in" data-delay="100">
            Straightforward pricing.<br />No surprises.
          </h2>
          <p className="pricing-sub fade-in" data-delay="150">
            Start free for 14 days. No credit card required.
          </p>

          <div className="pricing-toggle-wrap fade-in" data-delay="200">
            <span
              className={`toggle-label${mode === 'monthly' ? ' active' : ''}`}
              onClick={() => setMode('monthly')}
            >
              Monthly
            </span>
            <span
              className={`toggle-label${mode === 'annual' ? ' active' : ''}`}
              onClick={() => setMode('annual')}
            >
              Annual
            </span>
            <span className="toggle-savings">2 months free</span>
          </div>
        </div>

        <div className="pricing-cards">
          {PLANS.map((plan, i) => (
            <div
              className={`pricing-card fade-in${plan.featured ? ' featured' : ''}`}
              data-delay={String((i + 1) * 100)}
              key={plan.id}
            >
              {plan.featured && <div className="pricing-badge">Most popular</div>}
              <div className="pricing-plan-name">{plan.name}</div>

              <div className="pricing-price">
                <span className="price-currency">$</span>
                <span className="price-amount">{plan[mode]}</span>
                <span className="price-period">/mo</span>
              </div>

              <div className="pricing-unit-limit">{plan.limit}</div>
              <div className="pricing-divider" />

              <ul className="pricing-features">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>

              <Link
                href={`/signup?plan=${plan.id}`}
                className="pricing-cta"
              >
                Start Free Trial
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
