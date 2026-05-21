import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTripsForUser } from '@/lib/trip/actions'
import { AppSidebar } from '@/components/shared/AppSidebar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const tripsResult = await getTripsForUser()
  const trips = tripsResult.success ? tripsResult.data : []

  const fullName: string =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    'Adventurer'

  const initials = fullName
    .split(' ')
    .map((w: string) => w[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="app-shell">
      <AppSidebar user={{ name: fullName, initials }} trips={trips} />
      <main className="app-main">{children}</main>
    </div>
  )
}
