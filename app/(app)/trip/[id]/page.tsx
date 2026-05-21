import { notFound } from 'next/navigation'
import { getTripById } from '@/lib/trip/actions'
import { formatDateRange } from '@/lib/utils/format'

const AVATAR_COLORS = [
  'linear-gradient(135deg, #c4554a, #a13a30)',
  'linear-gradient(135deg, #4d806d, #2f6052)',
  'linear-gradient(135deg, #e8a23a, #b87a1f)',
  'linear-gradient(135deg, #ad7a64, #6b4a34)',
  'linear-gradient(135deg, #6C5CE7, #3D2C8D)',
]

type Props = { params: Promise<{ id: string }> }

export default async function TripPage({ params }: Props) {
  const { id } = await params
  const result = await getTripById(id)

  if (!result.success) notFound()

  const trip = result.data
  const dateRange = formatDateRange(trip.started_at, trip.ended_at)

  const statusLabel = trip.status === 'active' ? 'On the road' : trip.status === 'settled' ? 'Quest complete' : 'Archived'
  const isActive = trip.status === 'active'

  return (
    <>
      {/* ── Topbar ── */}
      <div className="app-topbar">
        <div className="app-crumb">
          <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</a>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3.5 2L6.5 5L3.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <b>{trip.name}</b>
        </div>
      </div>

      <div className="app-content">

        {/* ── Hero ── */}
        <section className="trip-hero">
          {/* Landscape scene */}
          <div className="trip-hero-scene">
            <span className="trip-hero-sun" />
            <span className="trip-hero-cloud" style={{ top: 18, left: 80, width: 80, height: 14 }} />
            <span className="trip-hero-cloud" style={{ top: 36, left: 140, width: 50, height: 10 }} />
            <span className="trip-hero-cloud" style={{ top: 22, right: 160, width: 64, height: 12 }} />
            <div className="trip-hero-mountains">
              <svg viewBox="0 0 800 100" preserveAspectRatio="none" fill="none">
                <path d="M0 100 L0 60 L80 32 L160 56 L240 26 L320 50 L420 22 L520 48 L620 28 L720 46 L800 32 L800 100 Z" fill="#5e8c7a" />
                <path d="M0 100 L0 72 L60 54 L140 68 L220 48 L320 66 L420 48 L520 64 L620 50 L720 60 L800 56 L800 100 Z" fill="#4d806d" />
                <path d="M0 100 L0 84 L80 76 L160 82 L240 74 L340 80 L440 74 L540 80 L640 74 L740 78 L800 76 L800 100 Z" fill="#2f6052" />
              </svg>
            </div>
          </div>

          {/* Trip info */}
          <div className="trip-hero-info">
            <div>
              <div className="trip-hero-title-row">
                <span className="trip-hero-emoji">{trip.cover_emoji}</span>
                <h1 className="trip-hero-title">{trip.name}</h1>
                <span className={`trip-hero-status-pill${isActive ? ' active' : ''}`}>
                  {isActive && <span className="trip-status-dot" />}
                  {statusLabel}
                </span>
              </div>
              <div className="trip-hero-meta">
                <span>{dateRange}</span>
                {trip.member_count > 0 && (
                  <>
                    <span className="trip-hero-sep">·</span>
                    <span><b>{trip.member_count}</b> {trip.member_count === 1 ? 'hero' : 'heroes'}</span>
                  </>
                )}
              </div>

              {/* Party avatars */}
              {trip.members.length > 0 && (
                <div className="trip-hero-party">
                  <div className="trip-avatar-stack">
                    {trip.members.slice(0, 5).map((m, i) => {
                      const label = (m.display_name ?? m.user_id).slice(0, 2).toUpperCase()
                      return (
                        <span
                          key={m.user_id}
                          className="trip-avatar"
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                          title={m.display_name ?? undefined}
                        >
                          {m.avatar_url
                            ? <img src={m.avatar_url} alt={label} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            : label}
                        </span>
                      )
                    })}
                  </div>
                  <span className="trip-hero-party-names">
                    {trip.members.map(m => m.display_name ?? 'Hero').join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Panels ── */}
        <div className="trip-grid">

          {/* Expense journal — empty state */}
          <section className="trip-panel">
            <div className="trip-panel-head">
              <h2 className="trip-panel-title">Expense <em>journal</em></h2>
            </div>
            <div className="trip-empty-state">
              <span className="trip-empty-icon">📜</span>
              <p className="trip-empty-text">No expenses logged yet</p>
              <p className="trip-empty-sub">Expense logging coming soon</p>
            </div>
          </section>

          {/* Party */}
          <section className="trip-panel">
            <div className="trip-panel-head">
              <h2 className="trip-panel-title">Party <em>members</em></h2>
            </div>
            <div className="trip-party-list">
              {trip.members.map((m, i) => {
                const label = (m.display_name ?? m.user_id).slice(0, 2).toUpperCase()
                return (
                  <div key={m.user_id} className="trip-party-member">
                    <div
                      className="trip-party-av"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    >
                      {m.avatar_url
                        ? <img src={m.avatar_url} alt={label} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        : label}
                    </div>
                    <div className="trip-party-info">
                      <div className="trip-party-name">{m.display_name ?? 'Hero'}</div>
                      <div className="trip-party-role">{i === 0 ? 'Quest leader' : 'Party member'}</div>
                    </div>
                    <div className="trip-party-bal">
                      <div className="trip-party-bal-amt">—</div>
                      <div className="trip-party-bal-lbl">balance</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
