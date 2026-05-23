'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatMoney } from '@/lib/utils/format'
import type { ExpenseWithPayer, TripBalances } from '@/types/expense'

function buildShareText(
  tripName: string,
  dateRange: string,
  coverEmoji: string | null,
  expenses: ExpenseWithPayer[],
  balances: TripBalances | null,
): string {
  const total = balances?.total ?? 0
  const lines: string[] = []

  lines.push(`${coverEmoji ?? '🎒'} ${tripName}`)
  lines.push(`📅 ${dateRange}`)
  lines.push(`💰 Total: ${formatMoney(total)}`)

  if (expenses.length > 0) {
    const byCategory: Record<string, number> = {}
    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] ?? 0) + e.final_amount
    }
    const CAT_EMOJI: Record<string, string> = {
      food: '🍽️', drink: '🍹', transport: '🚗',
      accommodation: '🏨', entertainment: '🎭', shopping: '🛍️', other: '📦',
    }
    const CAT_LABEL: Record<string, string> = {
      food: 'Food', drink: 'Drinks', transport: 'Transport',
      accommodation: 'Stay', entertainment: 'Fun', shopping: 'Shopping', other: 'Other',
    }
    const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
    lines.push('')
    lines.push('📊 By category:')
    for (const [cat, amt] of sorted) {
      const pct = total > 0 ? Math.round((amt / total) * 100) : 0
      lines.push(`  ${CAT_EMOJI[cat] ?? '📦'} ${CAT_LABEL[cat] ?? cat}: ${formatMoney(amt)} (${pct}%)`)
    }
  }

  if (balances && balances.members.length > 0) {
    lines.push('')
    lines.push('👥 Party balances:')
    for (const m of balances.members) {
      const name = m.display_name ?? 'Hero'
      const netStr =
        Math.abs(m.net) < 0.01
          ? 'settled ✅'
          : m.net > 0
            ? `gets back ${formatMoney(m.net)} ↑`
            : `owes ${formatMoney(Math.abs(m.net))} ↓`
      lines.push(`  ${name} — paid ${formatMoney(m.paid)}, ${netStr}`)
    }
  }

  if (balances && balances.transactions.length > 0) {
    lines.push('')
    lines.push('💸 Settle up:')
    for (const t of balances.transactions) {
      lines.push(`  ${t.from_name ?? 'Hero'} → ${t.to_name ?? 'Hero'}: ${formatMoney(t.amount)}`)
    }
  }

  lines.push('')
  lines.push('— via SplitQuest 🗡️')

  return lines.join('\n')
}

const CAT_EMOJI: Record<string, string> = {
  food: '🍽️', drink: '🍹', transport: '🚗',
  accommodation: '🏨', entertainment: '🎭', shopping: '🛍️', other: '📦',
}
const CAT_LABEL: Record<string, string> = {
  food: 'Food', drink: 'Drinks', transport: 'Transport',
  accommodation: 'Accommodation', entertainment: 'Entertainment',
  shopping: 'Shopping', other: 'Other',
}
const AVATAR_COLORS = [
  'linear-gradient(135deg, #c4554a, #a13a30)',
  'linear-gradient(135deg, #4d806d, #2f6052)',
  'linear-gradient(135deg, #e8a23a, #b87a1f)',
  'linear-gradient(135deg, #ad7a64, #6b4a34)',
  'linear-gradient(135deg, #6C5CE7, #3D2C8D)',
]

type Props = {
  tripName: string
  dateRange: string
  coverEmoji: string | null
  expenses: ExpenseWithPayer[]
  balances: TripBalances | null
  children: React.ReactNode
}

export function TripSummaryDialog({
  tripName, dateRange, coverEmoji, expenses, balances, children,
}: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const text = buildShareText(tripName, dateRange, coverEmoji, expenses, balances)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const total = balances?.total ?? 0

  const byCategory: Record<string, number> = {}
  for (const e of expenses) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.final_amount
  }
  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />

      <DialogContent className="sm:max-w-md" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <span>{coverEmoji ?? '🎒'}</span>
            {tripName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5">{dateRange}</p>
        </DialogHeader>

        <div className="summary-body">

          {/* ── Total ── */}
          <div className="summary-section">
            <div className="summary-label">Total spent</div>
            <div className="summary-total">
              {formatMoney(total)}
            </div>
            {expenses.length > 0 && (
              <div className="summary-sub">
                {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
                {sortedCategories.length > 1 && ` · ${sortedCategories.length} categories`}
              </div>
            )}
          </div>

          {/* ── By category ── */}
          {sortedCategories.length > 0 && (
            <div className="summary-section">
              <div className="summary-label">By category</div>
              {sortedCategories.map(([cat, amt]) => (
                <div key={cat} className="summary-cat-row">
                  <span className="summary-cat-icon">{CAT_EMOJI[cat] ?? '📦'}</span>
                  <span className="summary-cat-name">{CAT_LABEL[cat] ?? cat}</span>
                  <span className="summary-cat-amt">{formatMoney(amt)}</span>
                  <span className="summary-cat-pct">
                    {total > 0 ? Math.round((amt / total) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── Member balances ── */}
          {balances && balances.members.length > 0 && (
            <div className="summary-section">
              <div className="summary-label">Party balances</div>
              {balances.members.map((m, i) => {
                const label = (m.display_name ?? m.user_id).slice(0, 2).toUpperCase()
                const netClass = m.net > 0.01 ? 'owed' : m.net < -0.01 ? 'owes' : 'settled'
                return (
                  <div key={m.user_id} className="summary-member-row">
                    <div
                      className="summary-av"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    >
                      {m.avatar_url
                        ? <img src={m.avatar_url} alt={label} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        : label}
                    </div>
                    <div className="summary-member-info">
                      <div className="summary-member-name">{m.display_name ?? 'Hero'}</div>
                      <div className="summary-member-paid">Paid {formatMoney(m.paid)}</div>
                    </div>
                    <div className="summary-member-net">
                      <div className={`summary-net-amt ${netClass}`}>
                        {Math.abs(m.net) < 0.01
                          ? 'Settled'
                          : `${m.net > 0 ? '+' : ''}${formatMoney(m.net)}`}
                      </div>
                      <div className="summary-net-lbl">
                        {m.net > 0.01 ? 'owed to them' : m.net < -0.01 ? 'they owe' : ''}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Settle up ── */}
          {balances && balances.transactions.length > 0 && (
            <div className="summary-section">
              <div className="summary-label">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ display: 'inline', marginRight: 5 }}>
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

          {/* ── Empty ── */}
          {expenses.length === 0 && (
            <div className="summary-section summary-empty">
              <span>📜</span>
              <p>No expenses logged yet</p>
            </div>
          )}

        </div>

        {/* ── Share footer ── */}
        <div className="summary-share-row">
          <button
            type="button"
            className="summary-copy-btn"
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5L5 9.5L11 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M9 4V2.5A1.5 1.5 0 007.5 1h-5A1.5 1.5 0 001 2.5v5A1.5 1.5 0 002.5 9H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Copy summary
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
