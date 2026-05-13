'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardHeader() {
  const router = useRouter()

  return (
    <div className="dashboard-header">
      <Link href="/dashboard" className="dashboard-logo">
        Rent<span className="accent">Proof</span>
      </Link>
      <button 
        onClick={() => router.push('/dashboard')} 
        className="btn-back-dashboard"
        title="Back to Dashboard"
      >
        ← Dashboard
      </button>
    </div>
  )
}
