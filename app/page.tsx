'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to tenant portal
    router.push('/tenant/portal')
  }, [router])

  return <div>Redirecting to tenant portal...</div>
}
