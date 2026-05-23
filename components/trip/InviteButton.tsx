'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { createInvite } from '@/lib/invite/actions'

type Props = { tripId: string }

export function InviteButton({ tripId }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleInvite() {
    startTransition(async () => {
      const result = await createInvite(tripId)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      const url = `${window.location.origin}/invite/${result.data.code}`
      await navigator.clipboard.writeText(url)
      toast.success('Invite link copied! 🔗')
    })
  }

  return (
    <button
      onClick={handleInvite}
      disabled={isPending}
      className="trip-invite-btn"
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
        <path d="M9 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM4 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM9 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 2.5 5.5 7M7.5 9l-2-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
      {isPending ? 'Generating…' : 'Invite'}
    </button>
  )
}
