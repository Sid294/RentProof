'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import api from '@/lib/api'

interface MaintenanceRequest {
  id: string
  unit: string
  tenant: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  submittedDate: string
  completedDate?: string
  assignedTo?: string
}

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('open')
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (!u) {
        router.push('/login')
        return
      }

      try {
        const data = await api.dashboard.getMaintenance()
        setRequests(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load maintenance requests')
        console.error('Error loading maintenance:', err)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [router])

  const getPriorityClass = (priority: string) => `priority-${priority}`
  const getStatusClass = (status: string) => `status-${status}`

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter)

  if (loading) return <div className="loading">Loading maintenance requests...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="maintenance-page">
      <div className="page-header">
        <h1>Maintenance Requests</h1>
        <div className="filter-buttons">
          {['open', 'in-progress', 'completed', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="maintenance-list">
        {filteredRequests.map((request) => (
          <div key={request.id} className={`maintenance-card ${getStatusClass(request.status)}`}>
            <div className="card-header">
              <h3>{request.title}</h3>
              <div className="card-badges">
                <span className={`badge ${getPriorityClass(request.priority)}`}>
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                </span>
                <span className={`badge ${getStatusClass(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="card-content">
              <p className="description">{request.description}</p>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Unit</span>
                  <span className="value">{request.unit}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tenant</span>
                  <span className="value">{request.tenant}</span>
                </div>
                <div className="info-item">
                  <span className="label">Submitted</span>
                  <span className="value">{new Date(request.submittedDate).toLocaleDateString()}</span>
                </div>
                {request.assignedTo && (
                  <div className="info-item">
                    <span className="label">Assigned To</span>
                    <span className="value">{request.assignedTo}</span>
                  </div>
                )}
                {request.completedDate && (
                  <div className="info-item">
                    <span className="label">Completed</span>
                    <span className="value">{new Date(request.completedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="empty-state">
          <p>No maintenance requests in this category.</p>
        </div>
      )}
    </div>
  )
}
