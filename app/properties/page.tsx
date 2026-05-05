'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import api from '@/lib/api'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zipCode?: string
  units?: any[]
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (!u) {
        router.push('/login')
        return
      }

      try {
        const data = await api.dashboard.getProperties()
        setProperties(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load properties')
        console.error('Error loading properties:', err)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await api.dashboard.createProperty(
        formData.address,
        formData.city,
        formData.state,
        formData.zipCode
      )
      
      if (result.success) {
        setProperties([...properties, result.property])
        setFormData({ address: '', city: '', state: '', zipCode: '' })
        setShowForm(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property')
    }
  }

  if (loading) return <div className="loading">Loading properties...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="properties-page">
      <div className="page-header">
        <h1>Properties</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Property'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">Create Property</button>
        </form>
      )}

      <div className="properties-list">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <div className="property-header">
              <h3>{property.address}</h3>
              <span className="property-location">{property.city}, {property.state}</span>
            </div>
            {property.units && property.units.length > 0 && (
              <div className="property-units">
                <h4>Units ({property.units.length})</h4>
                <div className="units-grid">
                  {property.units.map((unit: any) => (
                    <div key={unit.id} className="unit-badge">
                      <span className="unit-name">{unit.name}</span>
                      <span className={`unit-status ${unit.status}`}>{unit.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="empty-state">
          <p>No properties yet. Create your first property to get started.</p>
        </div>
      )}
    </div>
  )
}
