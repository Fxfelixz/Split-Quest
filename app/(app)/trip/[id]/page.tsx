import { notFound } from 'next/navigation'
import { getTripById } from '@/lib/trip/actions'
import { getExpensesForTrip, getTripBalances } from '@/lib/expense/actions'
import { formatDateRange, formatMoney } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/server'
import { AddExpenseDialog } from '@/components/expense/AddExpenseDialog'
import { ExpenseList } from '@/components/expense/ExpenseList'
import { InviteButton } from '@/components/trip/InviteButton'
import { TripSummaryDialog } from '@/components/trip/TripSummaryDialog'

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

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id ?? ''

  const [expensesResult, balancesResult] = await Promise.all([
    getExpensesForTrip(id),
    getTripBalances(id, trip.members),
  ])

  const expenses = expensesResult.success ? expensesResult.data : []
  const balances = balancesResult.success ? balancesResult.data : null

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
        <TripSummaryDialog
          tripName={trip.name}
          dateRange={dateRange}
          coverEmoji={trip.cover_emoji}
          expenses={expenses}
          balances={balances}
        >
          <button className="trip-summary-btn">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 3.5h9M2 6.5h9M2 9.5h5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Summary
          </button>
        </TripSummaryDialog>
      </div>

      <div className="app-content">

        {/* ── Hero ── */}
        <section className="trip-hero">
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

          <div className="trip-hero-info">
            <div>
              <div className="trip-hero-title-row">
                <span className="trip-hero-emoji">{trip.cover_emoji}</span>
                <h1 className="trip-hero-title">{trip.name}</h1>
                <span className={`trip-hero-status-pill${isActive ? ' active' : ''}`}>
                  {isActive && <span className="trip-status-dot" />}
                  {statusLabel}
                </span>
                {balances && balances.total > 0 && (
                  <span className="trip-hero-total">
                    {formatMoney(balances.total)} total
                  </span>
                )}
              </div>
              <div className="trip-hero-meta">
                <span>{dateRange}</span>
                {trip.member_count > 0 && (
                  <>
                    <span className="trip-hero-sep">·</span>
                    <span><b>{trip.member_count}</b> {trip.member_count === 1 ? 'hero' : 'heroes'}</span>
                  </>
                )}
                {expenses.length > 0 && (
                  <>
                    <span className="trip-hero-sep">·</span>
                    <span><b>{expenses.length}</b> {expenses.length === 1 ? 'expense' : 'expenses'}</span>
                  </>
                )}
              </div>

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

          {/* Expense journal */}
          <section className="trip-panel">
            <div className="trip-panel-head">
              <h2 className="trip-panel-title">Expense <em>journal</em></h2>
              <AddExpenseDialog
                tripId={trip.id}
                members={trip.members}
                currentUserId={currentUserId}
              >
                <button className="trip-panel-btn trip-panel-btn-primary">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Add expense
                </button>
              </AddExpenseDialog>
            </div>
            <ExpenseList expenses={expenses} />
          </section>

          {/* Party + Balances */}
          <section className="trip-panel">
            <div className="trip-panel-head">
              <h2 className="trip-panel-title">Party <em>members</em></h2>
              <InviteButton tripId={trip.id} />
            </div>
            <div className="trip-party-list">
              {(balances?.members ?? trip.members.map(m => ({ ...m, paid: 0, owed: 0, net: 0 }))).map((m, i) => {
                const label = (m.display_name ?? m.user_id).slice(0, 2).toUpperCase()
                const netClass = m.net > 0.01 ? 'owed' : m.net < -0.01 ? 'owes' : ''
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
                      <div className={`trip-party-bal-amt ${netClass}`}>
                        {Math.abs(m.net) < 0.01 ? '—' : formatMoney(Math.abs(m.net))}
                      </div>
                      <div className="trip-party-bal-lbl">
                        {m.net > 0.01 ? 'owed to them' : m.net < -0.01 ? 'they owe' : 'settled'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Settle up */}
            {balances && balances.transactions.length > 0 && (
              <div className="trip-settle">
                <div className="trip-settle-head">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'inline', marginRight: 6 }}>
                    <path d="M1 6h10M7.5 2.5L11 6l-3.5 3.5M4.5 2.5L1 6l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Settle up
                </div>
                {balances.transactions.map((t, i) => (
                  <div key={i} className="settle-item">
                    <span className="settle-name">{t.from_name ?? 'Hero'}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="settle-arrow" aria-hidden>
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="settle-name">{t.to_name ?? 'Hero'}</span>
                    <span className="settle-amount">{formatMoney(t.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </>
  )
}
