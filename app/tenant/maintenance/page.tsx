'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function TenantMaintenancePage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    images: [] as string[],
  })
  const router = useRouter()

  // Mock tenant data - in real app would come from auth context
  const tenantId = 'tenant123'
  const unitId = 'unit2a'

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // In real implementation, would fetch tenant's maintenance requests
        // For now, showing empty list with form to submit
        setRequests([])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load requests')
        console.error('Error loading requests:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await api.tenant.submitMaintenance(
        tenantId,
        unitId,
        formData.title,
        formData.description,
        formData.priority,
        formData.images
      )

      if (result.success) {
        setRequests([...requests, result.request])
        setFormData({ title: '', description: '', priority: 'medium', images: [] })
        setShowForm(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request')
    }
  }

  if (loading) return <div className="loading">Loading maintenance requests...</div>

  return (
    <div className="tenant-maintenance-page">
      <div className="page-header">
        <h1>Maintenance Requests</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Submit New Request'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="maintenance-form">
          <h2>Submit Maintenance Request</h2>
          
          <div className="form-group">
            <label htmlFor="title">Issue Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Leaky faucet"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please describe the issue in detail..."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">Submit Request</button>
        </form>
      )}

      <div className="requests-list">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className="request-card">
              <h3>{request.title}</h3>
              <p>{request.description}</p>
              <div className="request-meta">
                <span className={`priority-${request.priority}`}>
                  {request.priority.toUpperCase()}
                </span>
                <span className={`status-${request.status}`}>
                  {request.status.toUpperCase()}
                </span>
                <span className="date">
                  {new Date(request.submittedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No maintenance requests submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
