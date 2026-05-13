'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import api from '@/lib/api'
import DashboardHeader from '@/components/layout/DashboardHeader'

interface Deposit {
  id: string
  unit: string
  tenant: string
  amount: number
  dateReceived: string
  moveInDate: string
  moveOutDate?: string
  status: 'held' | 'returned' | 'applied'
  returnDeadline?: string
  returnedDate?: string
  returnAmount?: number
}

export default function DepositsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (!u) {
        router.push('/login')
        return
      }

      try {
        const data = await api.dashboard.getDeposits()
        setDeposits(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deposits')
        console.error('Error loading deposits:', err)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [router])

  const getStatusClass = (status: string) => `status-${status}`
  const getTotalHeld = () => deposits
    .filter(d => d.status === 'held')
    .reduce((sum, d) => sum + d.amount, 0)

  if (loading) return <div className="loading">Loading deposits...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <>
      <DashboardHeader />
      <div className="deposits-page">
        <div className="dash-nav-buttons">
        <button 
          className={`nav-btn${pathname === '/properties' ? ' active' : ''}`}
          onClick={() => router.push('/properties')}
        >
          📍 Properties
        </button>
        <button 
          className={`nav-btn${pathname === '/maintenance' ? ' active' : ''}`}
          onClick={() => router.push('/maintenance')}
        >
          🔧 Maintenance
        </button>
        <button 
          className={`nav-btn${pathname === '/deposits' ? ' active' : ''}`}
          onClick={() => router.push('/deposits')}
        >
          🔒 Deposits
        </button>
        <button 
          className={`nav-btn${pathname === '/tenant/portal' ? ' active' : ''}`}
          onClick={() => router.push('/tenant/portal')}
        >
          👥 Tenants
        </button>
      </div>
      
      <div className="page-header">
        <h1>Security Deposits</h1>
        <div className="summary-card">
          <div className="summary-item">
            <span className="label">Total Held</span>
            <span className="value">${getTotalHeld().toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="label">Number of Deposits</span>
            <span className="value">{deposits.length}</span>
          </div>
        </div>
      </div>

      <div className="deposits-list">
        {deposits.map((deposit) => (
          <div key={deposit.id} className={`deposit-card ${getStatusClass(deposit.status)}`}>
            <div className="card-header">
              <div>
                <h3>Unit {deposit.unit}</h3>
                <p className="tenant-name">{deposit.tenant}</p>
              </div>
              <span className={`badge ${getStatusClass(deposit.status)}`}>
                {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
              </span>
            </div>

            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Deposit Amount</span>
                  <span className="value amount">${deposit.amount.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Date Received</span>
                  <span className="value">{new Date(deposit.dateReceived).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Move-in Date</span>
                  <span className="value">{new Date(deposit.moveInDate).toLocaleDateString()}</span>
                </div>
                {deposit.moveOutDate && (
                  <div className="info-item">
                    <span className="label">Move-out Date</span>
                    <span className="value">{new Date(deposit.moveOutDate).toLocaleDateString()}</span>
                  </div>
                )}
                {deposit.returnDeadline && deposit.status === 'held' && (
                  <div className="info-item">
                    <span className="label">Return Deadline</span>
                    <span className="value">{new Date(deposit.returnDeadline).toLocaleDateString()}</span>
                  </div>
                )}
                {deposit.returnedDate && (
                  <div className="info-item">
                    <span className="label">Returned Date</span>
                    <span className="value">{new Date(deposit.returnedDate).toLocaleDateString()}</span>
                  </div>
                )}
                {deposit.returnAmount && (
                  <div className="info-item">
                    <span className="label">Return Amount</span>
                    <span className="value amount">${deposit.returnAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {deposits.length === 0 && (
        <div className="empty-state">
          <p>No deposits recorded yet.</p>
        </div>
      )}
    </div>
    </>
  )
}
