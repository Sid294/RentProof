'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import Link from 'next/link'

interface PricingPlan {
  id: string
  name: string
  monthlyPrice: number
  annualPrice: number
  unitLimit: number | null
  description: string
  features: string[]
  cta: string
  link: string
}

export default function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true)
        const data = await api.content.getPricing()
        setPlans(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pricing')
        console.error('Error loading pricing:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [])

  if (loading) return <div className="loading">Loading pricing...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <section className="section pricing-section" id="pricing">
      <div className="container">
        <div className="section-label fade-in">Pricing</div>

        <h2 className="pricing-headline fade-in" data-delay="100">
          Plans that grow with your portfolio.
        </h2>

        {/* Billing Cycle Toggle */}
        <div className="billing-toggle fade-in" data-delay="200">
          <button
            className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}
            onClick={() => setBillingCycle('annual')}
          >
            Annual <span className="save-badge">Save 15%</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {plans.map((plan, index) => {
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12)
            const isHighlighted = plan.name.toLowerCase() === 'growth'

            return (
              <div
                key={plan.id}
                className={`pricing-card fade-in ${isHighlighted ? 'highlighted' : ''}`}
                data-delay={index * 100}
              >
                {isHighlighted && <div className="popular-badge">Most Popular</div>}

                <div className="card-header">
                  <h3>{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="card-price">
                  <span className="currency">$</span>
                  <span className="amount">{price}</span>
                  <span className="period">/{billingCycle === 'monthly' ? 'month' : 'month billed annually'}</span>
                </div>

                {plan.unitLimit && (
                  <p className="unit-limit">
                    Up to <strong>{plan.unitLimit}</strong> {plan.unitLimit === 1 ? 'unit' : 'units'}
                  </p>
                )}

                <ul className="features-list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="check-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={plan.link} className={`btn ${isHighlighted ? 'btn-primary' : 'btn-secondary'}`}>
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        <div className="pricing-footer fade-in">
          <p>
            All plans include 14-day free trial. No credit card required.
            <br />
            <strong>Questions?</strong> <a href="mailto:hello@rentproof.app">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  )
}
