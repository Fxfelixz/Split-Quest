'use client'

import { useState, useTransition } from 'react'
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
import { createTrip } from '@/lib/trip/actions'

const COVER_EMOJIS = ['🎒', '🏖️', '⛰️', '🌃', '🍜', '✈️', '🎢', '🏕️', '🍻', '🎡', '🚗', '🚆']

type Props = {
  children: React.ReactNode  // trigger element
}

export function CreateTripDialog({ children }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [emoji, setEmoji] = useState('🎒')
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [nameError, setNameError] = useState('')

  function resetForm() {
    setEmoji('🎒')
    setName('')
    setStartDate('')
    setEndDate('')
    setNameError('')
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) resetForm()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = name.trim()
    if (!trimmed) {
      setNameError('Quest name is required')
      return
    }
    if (trimmed.length > 100) {
      setNameError('Must be 100 characters or less')
      return
    }
    setNameError('')

    startTransition(async () => {
      const result = await createTrip({
        name: trimmed,
        cover_emoji: emoji,
        started_at: startDate || undefined,
        ended_at: endDate || undefined,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Quest started! ⚔️')
      setOpen(false)
      resetForm()
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children as React.ReactElement} />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg tracking-wide">
            New Quest
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-1">
          {/* ── Emoji picker ── */}
          <div className="flex flex-col gap-2">
            <Label>Cover</Label>
            <div className="grid grid-cols-6 gap-1.5">
              {COVER_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`
                    flex h-10 w-full items-center justify-center rounded-lg border-2 text-xl
                    transition-all duration-75
                    ${e === emoji
                      ? 'border-foreground bg-accent [box-shadow:2px_2px_0_0_hsl(var(--foreground))]'
                      : 'border-border hover:border-foreground/40'
                    }
                  `}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* ── Quest name ── */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="trip-name">
              Quest Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="trip-name"
              placeholder="e.g. Chiang Mai Reunion"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (nameError) setNameError('')
              }}
              maxLength={100}
              autoFocus
            />
            {nameError && (
              <p className="text-xs text-destructive">{nameError}</p>
            )}
          </div>

          {/* ── Dates ── */}
          <div className="flex flex-col gap-1.5">
            <Label>Dates (optional)</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1"
                placeholder="Start"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="flex-1"
                placeholder="End"
              />
            </div>
          </div>

          {/* ── Footer ── */}
          <DialogFooter className="mt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="
                transition-all duration-75
                [box-shadow:0_3px_0_0_hsl(var(--primary)/0.6)]
                hover:-translate-y-px hover:[box-shadow:0_4px_0_0_hsl(var(--primary)/0.6)]
                active:translate-y-0.5 active:[box-shadow:0_1px_0_0_hsl(var(--primary)/0.6)]
              "
            >
              {isPending ? 'Starting…' : 'Start Quest'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
