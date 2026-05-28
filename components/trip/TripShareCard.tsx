'use client'

import { useRef, useState } from 'react'
import { formatMoney } from '@/lib/utils/format'
import type { ExpenseWithPayer, TripBalances } from '@/types/expense'

const CAT_EMOJI: Record<string, string> = {
  food: '🍽️', drink: '🍹', transport: '🚗',
  accommodation: '🏨', entertainment: '🎭', shopping: '🛍️', other: '📦',
}
const CAT_LABEL: Record<string, string> = {
  food: 'Food', drink: 'Drinks', transport: 'Transport',
  accommodation: 'Stay', entertainment: 'Fun', shopping: 'Shopping', other: 'Other',
}

type Props = {
  tripName: string
  dateRange: string
  coverEmoji: string | null
  expenses: ExpenseWithPayer[]
  balances: TripBalances | null
}

export function TripShareCard({ tripName, dateRange, coverEmoji, expenses, balances }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)

  const total = balances?.total ?? 0

  const byCategory: Record<string, number> = {}
  for (const e of expenses) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.final_amount
  }
  const topCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 4)

  async function handleSave() {
    if (!cardRef.current) return
    setError(false)
    setSaving(true)
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
      const link = document.createElement('a')
      link.download = `${tripName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-splitquest.png`
      link.href = dataUrl
      link.click()
    } catch {
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

      {/* ── Card preview ── */}
      <div ref={cardRef} className="share-card">

        {/* Header */}
        <div className="share-card-header">
          <span className="share-card-emoji">{coverEmoji ?? '🎒'}</span>
          <div>
            <div className="share-card-trip-name">{tripName}</div>
            <div className="share-card-date">{dateRange}</div>
          </div>
        </div>

        {/* Total */}
        <div className="share-card-total-row">
          <span className="share-card-total-label">Total spent</span>
          <span className="share-card-total-amt">{formatMoney(total)}</span>
        </div>

        {/* Categories */}
        {topCats.length > 0 && (
          <div className="share-card-cats">
            {topCats.map(([cat, amt]) => (
              <div key={cat} className="share-card-cat-row">
                <span style={{ fontSize: 15 }}>{CAT_EMOJI[cat] ?? '📦'}</span>
                <span className="share-card-cat-name">{CAT_LABEL[cat] ?? cat}</span>
                <span className="share-card-cat-amt">{formatMoney(amt)}</span>
                <span className="share-card-cat-pct">
                  {total > 0 ? Math.round((amt / total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Settle up */}
        {balances && balances.transactions.length > 0 && (
          <div className="share-card-settle">
            <div className="share-card-settle-title">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ display: 'inline', marginRight: 5 }}>
                <path d="M1 6h10M7.5 2.5L11 6l-3.5 3.5M4.5 2.5L1 6l3.5 3.5" stroke="#7a6b58" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Settle up
            </div>
            {balances.transactions.map((t, i) => (
              <div key={i} className="share-card-settle-row">
                <span>{t.from_name ?? 'Hero'}</span>
                <span className="share-card-arrow">→</span>
                <span>{t.to_name ?? 'Hero'}</span>
                <span className="share-card-settle-amt">{formatMoney(t.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="share-card-footer">
          <span>⚔️ SplitQuest</span>
          <span>{expenses.length} expense{expenses.length !== 1 ? 's' : ''} · {balances?.members.length ?? 0} heroes</span>
        </div>

      </div>

      {/* ── Save button ── */}
      <button className="summary-copy-btn" onClick={handleSave} disabled={saving}>
        {saving ? (
          'Saving…'
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5v7M3.5 6.5l3 3 3-3M2 11.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Save as image
          </>
        )}
      </button>
      {error && <p style={{ fontSize: 11, color: 'var(--destructive)', marginTop: -8 }}>Failed to capture — try again</p>}

    </div>
  )
}
