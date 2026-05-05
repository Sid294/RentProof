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

  const getIconSvg = (iconName: string) => {
    const icons: { [key: string]: string } = {
      'chart-dots': '<circle cx="12" cy="12" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="16" r="1"/><path d="M3 21v-7m0 0V9m0 5l3-3m0 0l6-6m0 0l6 6" stroke="currentColor" strokeWidth="2" fill="none"/>',
      'calendar': '<rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/><circle cx="7" cy="15" r="1.5"/><circle cx="12" cy="15" r="1.5"/><circle cx="17" cy="15" r="1.5"/>',
      'wrench': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" fill="none"/>',
      'lock': '<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="16" r="1" fill="currentColor"/>',
      'file': '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="13 2 13 9 20 9" stroke="currentColor" strokeWidth="2" fill="none"/>',
      'message': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" fill="none"/>',
    }
    return icons[iconName] || icons['chart-dots']
  }

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
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <g dangerouslySetInnerHTML={{ __html: getIconSvg(feature.icon) }} />
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
