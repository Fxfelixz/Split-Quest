'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { addExpense, type SplitMode } from '@/lib/expense/actions'
import { formatMoney } from '@/lib/utils/format'
import type { ExpenseCategory } from '@/types/expense'

const CATEGORIES: Array<{ value: ExpenseCategory; emoji: string; label: string }> = [
  { value: 'food',          emoji: '🍽️', label: 'Food' },
  { value: 'drink',         emoji: '🍹', label: 'Drink' },
  { value: 'transport',     emoji: '🚗', label: 'Transport' },
  { value: 'accommodation', emoji: '🏨', label: 'Stay' },
  { value: 'entertainment', emoji: '🎭', label: 'Fun' },
  { value: 'shopping',      emoji: '🛍️', label: 'Shop' },
  { value: 'other',         emoji: '📦', label: 'Other' },
]

const SPLIT_MODES: Array<{ value: SplitMode; label: string }> = [
  { value: 'equal',   label: '⚖️ Equal' },
  { value: 'exact',   label: '🔢 Exact' },
  { value: 'percent', label: '% Percent' },
]

const AVATAR_COLORS = [
  'linear-gradient(135deg, #c4554a, #a13a30)',
  'linear-gradient(135deg, #4d806d, #2f6052)',
  'linear-gradient(135deg, #e8a23a, #b87a1f)',
  'linear-gradient(135deg, #ad7a64, #6b4a34)',
  'linear-gradient(135deg, #6C5CE7, #3D2C8D)',
]

type Member = {
  user_id: string
  display_name: string | null
  avatar_url: string | null
}

type Props = {
  tripId: string
  members: Member[]
  currentUserId: string
  children: React.ReactNode
}

export function AddExpenseDialog({ tripId, members, currentUserId, children }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [category, setCategory]       = useState<ExpenseCategory>('food')
  const [title, setTitle]             = useState('')
  const [amount, setAmount]           = useState('')
  const [payerId, setPayerId]         = useState(currentUserId)
  const [splitMode, setSplitMode]     = useState<SplitMode>('equal')
  const [selectedIds, setSelectedIds] = useState<string[]>(members.map(m => m.user_id))
  const [exactShares, setExactShares] = useState<Record<string, string>>({})
  const [pctShares, setPctShares]     = useState<Record<string, string>>({})
  const [errors, setErrors]           = useState<Record<string, string>>({})

  const parsedAmount = parseFloat(amount) || 0

  // Real-time totals for the footer hint
  const exactTotal = useMemo(
    () => selectedIds.reduce((s, id) => s + (parseFloat(exactShares[id] || '0') || 0), 0),
    [selectedIds, exactShares]
  )
  const pctTotal = useMemo(
    () => selectedIds.reduce((s, id) => s + (parseFloat(pctShares[id] || '0') || 0), 0),
    [selectedIds, pctShares]
  )

  function resetForm() {
    setCategory('food')
    setTitle('')
    setAmount('')
    setPayerId(currentUserId)
    setSplitMode('equal')
    setSelectedIds(members.map(m => m.user_id))
    setExactShares({})
    setPctShares({})
    setErrors({})
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) resetForm()
  }

  function toggleMember(id: string) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!title.trim()) errs.title = 'Title is required'
    if (parsedAmount <= 0) errs.amount = 'Enter a valid amount'
    if (!selectedIds.length) errs.split = 'Select at least one member'

    if (splitMode === 'exact' && Math.abs(exactTotal - parsedAmount) > 0.01) {
      errs.split = `Exact amounts must sum to ${formatMoney(parsedAmount)} (currently ${formatMoney(exactTotal)})`
    }
    if (splitMode === 'percent' && Math.abs(pctTotal - 100) > 0.01) {
      errs.split = `Percentages must sum to 100% (currently ${pctTotal.toFixed(1)}%)`
    }

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})

    const custom_shares: Record<string, number> = {}
    if (splitMode === 'exact') {
      selectedIds.forEach(id => { custom_shares[id] = parseFloat(exactShares[id] || '0') })
    } else if (splitMode === 'percent') {
      selectedIds.forEach(id => { custom_shares[id] = parseFloat(pctShares[id] || '0') })
    }

    startTransition(async () => {
      const result = await addExpense({
        trip_id: tripId,
        payer_id: payerId,
        title: title.trim(),
        category,
        amount: parsedAmount,
        split_mode: splitMode,
        member_ids: selectedIds,
        custom_shares: splitMode === 'equal' ? undefined : custom_shares,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Expense logged! 💰')
      setOpen(false)
      resetForm()
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children as React.ReactElement} />

      <DialogContent className="sm:max-w-md" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <DialogHeader>
          <DialogTitle className="font-display text-lg tracking-wide">Log Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-1">

          {/* ── Category ── */}
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <div className="grid grid-cols-7 gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  title={cat.label}
                  onClick={() => setCategory(cat.value)}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 py-2 text-lg transition-all duration-75
                    ${cat.value === category
                      ? 'border-foreground bg-accent [box-shadow:2px_2px_0_0_hsl(var(--foreground))]'
                      : 'border-border hover:border-foreground/40'}`}
                >
                  {cat.emoji}
                  <span className="text-[9px] font-semibold text-muted-foreground leading-none">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Title ── */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="exp-title">What for? <span className="text-destructive">*</span></Label>
            <Input
              id="exp-title"
              placeholder="e.g. Pad Thai at Night Market"
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                if (errors.title) setErrors(p => ({ ...p, title: '' }))
              }}
              maxLength={100}
              autoFocus
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          {/* ── Amount + Paid by ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="exp-amount">Amount (฿) <span className="text-destructive">*</span></Label>
              <Input
                id="exp-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value)
                  if (errors.amount) setErrors(p => ({ ...p, amount: '' }))
                }}
              />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="exp-payer">Paid by</Label>
              <select id="exp-payer" value={payerId} onChange={e => setPayerId(e.target.value)} className="exp-select">
                {members.map(m => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.display_name ?? 'Hero'}{m.user_id === currentUserId ? ' (me)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Split mode tabs ── */}
          <div className="flex flex-col gap-2">
            <Label>Split method</Label>
            <div className="split-tabs">
              {SPLIT_MODES.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => { setSplitMode(m.value); setErrors(p => ({ ...p, split: '' })) }}
                  className={`split-tab-item${splitMode === m.value ? ' active' : ''}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Split between ── */}
          <div className="flex flex-col gap-1.5">
            <Label>Split between</Label>
            <div className="flex flex-col gap-1">
              {members.map((m, i) => {
                const isOn = selectedIds.includes(m.user_id)
                const initials = (m.display_name ?? m.user_id).slice(0, 2).toUpperCase()

                // preview per-member share for equal split
                const equalShare = isOn && parsedAmount > 0 && selectedIds.length > 0
                  ? parsedAmount / selectedIds.length
                  : null

                return (
                  <div key={m.user_id} className="member-split-row">
                    {/* toggle */}
                    <button
                      type="button"
                      onClick={() => toggleMember(m.user_id)}
                      className={`member-toggle${isOn ? ' checked' : ''}`}
                      aria-label={isOn ? 'Deselect' : 'Select'}
                    />

                    {/* avatar */}
                    <div
                      style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                        display: 'grid', placeItems: 'center',
                        color: '#faf3e0', fontSize: 9, fontWeight: 700, overflow: 'hidden',
                      }}
                    >
                      {m.avatar_url
                        ? <img src={m.avatar_url} alt={initials} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        : initials}
                    </div>

                    {/* name */}
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: isOn ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                      {m.display_name ?? 'Hero'}
                    </span>

                    {/* per-member input */}
                    {isOn && splitMode === 'exact' && (
                      <input
                        className="member-share-input"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={exactShares[m.user_id] ?? ''}
                        onChange={e => setExactShares(p => ({ ...p, [m.user_id]: e.target.value }))}
                      />
                    )}
                    {isOn && splitMode === 'percent' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input
                          className="member-share-input"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="0"
                          value={pctShares[m.user_id] ?? ''}
                          onChange={e => setPctShares(p => ({ ...p, [m.user_id]: e.target.value }))}
                          style={{ width: 64 }}
                        />
                        <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>%</span>
                      </div>
                    )}
                    {isOn && splitMode === 'equal' && equalShare !== null && (
                      <span className="member-share-preview">{formatMoney(equalShare)}</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* running total hint */}
            {splitMode === 'exact' && parsedAmount > 0 && (
              <p className={`text-xs mt-1 ${Math.abs(exactTotal - parsedAmount) < 0.01 ? 'text-green-600' : 'text-muted-foreground'}`}>
                Assigned {formatMoney(exactTotal)} · Remaining {formatMoney(Math.max(0, parsedAmount - exactTotal))}
              </p>
            )}
            {splitMode === 'percent' && (
              <p className={`text-xs mt-1 ${Math.abs(pctTotal - 100) < 0.01 ? 'text-green-600' : 'text-muted-foreground'}`}>
                {pctTotal.toFixed(1)}% assigned · {Math.max(0, 100 - pctTotal).toFixed(1)}% remaining
              </p>
            )}
            {errors.split && <p className="text-xs text-destructive">{errors.split}</p>}
          </div>

          <DialogFooter className="mt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="transition-all duration-75 [box-shadow:0_3px_0_0_hsl(var(--primary)/0.6)] hover:-translate-y-px hover:[box-shadow:0_4px_0_0_hsl(var(--primary)/0.6)] active:translate-y-0.5 active:[box-shadow:0_1px_0_0_hsl(var(--primary)/0.6)]"
            >
              {isPending ? 'Saving…' : 'Log Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
