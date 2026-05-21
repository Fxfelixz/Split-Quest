import { TripCard } from './TripCard'
import type { TripWithMembers } from '@/types/trip'

type Props = {
  trips: TripWithMembers[]
  emptyMessage?: string
}

export function TripList({ trips, emptyMessage }: Props) {
  if (trips.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  )
}

function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <span className="text-5xl">🗺️</span>
      <h3 className="font-heading text-base font-semibold text-foreground">
        No quests yet
      </h3>
      <p className="text-sm text-muted-foreground">
        {message ?? 'Your adventure starts with a single step'}
      </p>
    </div>
  )
}
