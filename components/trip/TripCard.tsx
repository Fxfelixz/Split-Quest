'use client'

import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDateRange } from '@/lib/utils/format'
import type { TripWithMembers } from '@/types/trip'

type Props = {
  trip: TripWithMembers
}

const AVATAR_LIMIT = 3

export function TripCard({ trip }: Props) {
  const router = useRouter()
  const overflow = trip.member_count - AVATAR_LIMIT
  const visibleMembers = trip.members.slice(0, AVATAR_LIMIT)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/trip/${trip.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/trip/${trip.id}`)}
      className="
        group flex flex-col gap-3 rounded-2xl border-2 border-foreground
        bg-card p-5 cursor-pointer select-none
        [box-shadow:3px_3px_0_0_hsl(var(--foreground))]
        transition-all duration-100 ease-out
        hover:-translate-x-px hover:-translate-y-px
        hover:[box-shadow:4px_4px_0_0_hsl(var(--foreground))]
        active:translate-x-0 active:translate-y-0
        active:[box-shadow:1px_1px_0_0_hsl(var(--foreground))]
      "
    >
      {/* ── Header: emoji + status ── */}
      <div className="flex items-start justify-between">
        <span className="text-3xl leading-none">{trip.cover_emoji ?? '🎒'}</span>
        <StatusBadge status={trip.status} />
      </div>

      {/* ── Trip name + date ── */}
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-wide line-clamp-2">
          {trip.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatDateRange(trip.started_at, trip.ended_at)}
        </p>
      </div>

      {/* ── Divider ── */}
      <hr className="border-border" />

      {/* ── Members ── */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {visibleMembers.map((member, i) => (
            <Avatar
              key={member.user_id}
              className={`h-7 w-7 border-2 border-background ${i > 0 ? '-ml-2' : ''}`}
            >
              <AvatarImage src={member.avatar_url ?? undefined} alt={member.display_name ?? 'Member'} />
              <AvatarFallback className="text-xs">
                {member.display_name?.[0]?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {overflow > 0
            ? `+${overflow} heroes`
            : `${trip.member_count} ${trip.member_count === 1 ? 'hero' : 'heroes'}`}
        </span>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: 'active' | 'settled' | 'archived' }) {
  if (status === 'active') {
    return (
      <span className="rounded-md bg-[#FDCB6E] px-2 py-0.5 text-xs font-semibold text-foreground">
        Active
      </span>
    )
  }
  if (status === 'settled') {
    return (
      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
        Settled
      </span>
    )
  }
  return null
}
