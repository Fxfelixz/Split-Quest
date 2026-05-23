'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { joinTripByInvite } from '@/lib/invite/actions'

type Props = { code: string }

export function JoinButton({ code }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleJoin() {
    startTransition(async () => {
      const result = await joinTripByInvite(code)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Joined the quest! ⚔️')
      router.push(`/trip/${result.data.trip_id}`)
    })
  }

  return (
    <button
      onClick={handleJoin}
      disabled={isPending}
      className="invite-join-btn"
    >
      {isPending ? 'Joining…' : '⚔️ Join the Quest'}
    </button>
  )
}
