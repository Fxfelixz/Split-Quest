'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CreateTripDialog } from '@/components/trip/CreateTripDialog'

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="mobile-bottom-nav">

      {/* Dashboard */}
      <a href="/dashboard" className={`mbn-item${pathname === '/dashboard' ? ' active' : ''}`}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>Dashboard</span>
      </a>

      {/* New Quest FAB */}
      <CreateTripDialog>
        <button className="mbn-fab" aria-label="New quest">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 4v14M4 11h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </CreateTripDialog>

      {/* Sign out */}
      <button className="mbn-item" onClick={handleSignOut} aria-label="Sign out">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 4H4a1 1 0 00-1 1v10a1 1 0 001 1h3.5M13 14l4-4-4-4M17 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Sign out</span>
      </button>

    </nav>
  )
}
