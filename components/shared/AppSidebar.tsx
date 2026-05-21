'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CreateTripDialog } from '@/components/trip/CreateTripDialog'
import type { TripWithMembers } from '@/types/trip'

type Props = {
  user: { name: string; initials: string }
  trips: TripWithMembers[]
}

const STAMP_CLASSES = ['stamp-a', 'stamp-b', 'stamp-c', 'stamp-d']

export function AppSidebar({ user, trips }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const activeTrips = trips.filter((t) => t.status === 'active')

  return (
    <aside className="app-sidebar">
      {/* Brand */}
      <a href="/dashboard" className="sidebar-brand">
        <span className="sidebar-brand-mark">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L10.5 6L14.5 6L11.3 8.5L12.5 13L9 10.5L5.5 13L6.7 8.5L3.5 6L7.5 6Z" fill="currentColor" />
          </svg>
        </span>
        Split<b>Quest</b>
      </a>

      {/* Nav */}
      <div className="sidebar-section">
        <div className="sidebar-label">Menu</div>
        <a href="/dashboard" className={`sidebar-nav-item${pathname === '/dashboard' ? ' active' : ''}`}>
          <span className="nav-ico">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
              <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
              <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
              <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          Dashboard
        </a>
      </div>

      {/* Active trips */}
      <div className="sidebar-section" style={{ flex: 1 }}>
        <div className="sidebar-label">
          Quests
          {activeTrips.length > 0 && (
            <span className="sidebar-count">{activeTrips.length}</span>
          )}
        </div>

        {trips.map((trip, i) => {
          const initial = trip.name[0]?.toUpperCase() ?? '?'
          const stampClass = STAMP_CLASSES[i % STAMP_CLASSES.length]
          const isActive = pathname === `/trip/${trip.id}`
          return (
            <a
              key={trip.id}
              href={`/trip/${trip.id}`}
              className={`sidebar-trip-pill${isActive ? ' active' : ''}`}
            >
              <span className={`sidebar-trip-stamp ${stampClass}`}>{initial}</span>
              <span className="sidebar-trip-info">
                <span className="sidebar-trip-name">{trip.name}</span>
                <span className="sidebar-trip-meta">
                  {trip.member_count} {trip.member_count === 1 ? 'hero' : 'heroes'}
                  {trip.status === 'settled' ? ' · settled' : ''}
                </span>
              </span>
            </a>
          )
        })}

        <CreateTripDialog>
          <button className="sidebar-new-trip">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            New quest
          </button>
        </CreateTripDialog>
      </div>

      {/* User tile */}
      <div className="sidebar-user">
        <div className="sidebar-user-av">{user.initials}</div>
        <div>
          <div className="sidebar-user-name">{user.name}</div>
        </div>
        <button className="sidebar-signout" onClick={handleSignOut} title="Sign out">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M5.5 2H3a1 1 0 00-1 1v9a1 1 0 001 1h2.5M10 10.5l3-3-3-3M13 7.5H5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  )
}
