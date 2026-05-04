'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

interface RentUnit {
  id: string
  unit: string
  tenant: string
  amount: number
  status: 'paid' | 'pending' | 'late'
  paidDate?: string
  daysLate?: number
}

interface RentStatus {
  month: string
  totalUnits: number
  collectedUnits: number
  percentageCollected: number
  totalRentExpected: number
  totalRentCollected: number
  units: RentUnit[]
}

export default function RentDashboard() {
  const [rentStatus, setRentStatus] = useState<RentStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchRentStatus = async () => {
      try {
        // Check if user is authenticated
        const authCheck = await api.auth.checkAuth()
        if (!authCheck.authenticated) {
          router.push('/login')
          return
        }

        // Fetch rent status
        setLoading(true)
        const data = await api.dashboard.getRentStatus()
        setRentStatus(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load rent status')
        console.error('Error loading rent status:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRentStatus()
  }, [router])

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'badge-paid'
      case 'pending':
        return 'badge-pending'
      case 'late':
        return 'badge-late'
      default:
        return 'badge'
    }
  }

  const getStatusLabel = (unit: RentUnit) => {
    if (unit.status === 'late') {
      return `${unit.daysLate} days late`
    }
    return unit.status.charAt(0).toUpperCase() + unit.status.slice(1)
  }

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!rentStatus) return <div className="error">No data available</div>

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div className="dash-title-block">
          <div className="dash-title">Rent Dashboard</div>
          <div className="dash-subtitle">
            {rentStatus.month} — {rentStatus.collectedUnits} of{' '}
            {rentStatus.totalUnits} units collected
          </div>
        </div>
        <div className="dash-progress-wrap">
          <div className="dash-progress-bar">
            <div
              className="dash-progress-fill"
              style={{ width: `${rentStatus.percentageCollected}%` }}
            ></div>
          </div>
          <div className="dash-progress-label">
            {rentStatus.percentageCollected}% collected
          </div>
        </div>
      </div>

      <div className="dash-table">
        <div className="dash-row dash-row-header">
          <span>Unit</span>
          <span>Tenant</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        {rentStatus.units.map((unit) => (
          <div key={unit.id} className="dash-row">
            <span className="dash-unit">{unit.unit}</span>
            <span className="dash-tenant">{unit.tenant}</span>
            <span className="dash-amount">${unit.amount}</span>
            <span className={`badge ${getStatusBadgeClass(unit.status)}`}>
              {getStatusLabel(unit)}
            </span>
          </div>
        ))}
      </div>

      <div className="dash-footer">
        <div className="dash-total-label">Total collected</div>
        <div className="dash-total-amount">
          ${rentStatus.totalRentCollected} <span>of ${rentStatus.totalRentExpected}</span>
        </div>
      </div>
    </div>
  )
}
