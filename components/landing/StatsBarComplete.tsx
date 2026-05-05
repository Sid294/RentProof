'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface Stat {
  id: number
  number: string
  label: string
  icon: string
}

export default function StatsBar() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await api.content.getStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
        console.error('Error loading stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: string } = {
      'dollar': '💰',
      'chart': '📊',
      'lightning': '⚡',
    }
    return icons[iconName] || '📈'
  }

  if (loading) return <div className="loading">Loading stats...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <section className="section stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="stat-card fade-in"
              data-delay={index * 100}
            >
              <div className="stat-icon">{getIcon(stat.icon)}</div>
              <p className="stat-number">{stat.number}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
