'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface Feature {
  id: string
  tag: string
  title: string
  description: string
  icon: string
}

export default function FeaturesGrid() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true)
        const data = await api.content.getFeatures()
        setFeatures(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load features')
        console.error('Error loading features:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [])

  if (loading) return <div className="loading">Loading features...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <section className="section features-section" id="features">
      <div className="container">
        <div className="section-label fade-in">Features</div>

        <h2 className="features-headline fade-in" data-delay="100">
          Everything you need to run a professional operation.
        </h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="feature-card fade-in"
              data-delay={index > 0 ? index * 50 : undefined}
            >
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">
                  {/* Icon would be rendered based on feature.icon */}
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div className="feature-tag">{feature.tag}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
