'use client'

import { useState } from 'react'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function TenantPayRentForm() {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // These would come from session/context in a real app
  const tenantId = 'tenant123'
  const unitId = 'unit2a'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      setLoading(true)

      const amountNumber = parseFloat(amount)
      if (isNaN(amountNumber) || amountNumber <= 0) {
        setError('Please enter a valid amount')
        return
      }

      // Call pay rent API
      const result = await api.tenant.payRent(
        tenantId,
        unitId,
        amountNumber,
        paymentMethod
      )

      if (result.success) {
        setSuccess(true)
        setAmount('')
        // Redirect to receipt or confirmation page
        setTimeout(() => {
          router.push(`/receipt/${result.payment.id}`)
        }, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="success-message">
        <h2>Payment Submitted Successfully!</h2>
        <p>Check your email for the receipt and confirmation.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>Pay Rent</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <div className="amount-input">
          <span>$</span>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="method">Payment Method</label>
        <select
          id="method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          disabled={loading}
        >
          <option value="bank">Bank Transfer</option>
          <option value="card">Credit/Debit Card</option>
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Submit Payment'}
      </button>
    </form>
  )
}
