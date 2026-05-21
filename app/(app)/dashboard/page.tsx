import { createClient } from '@/lib/supabase/server'
import { getTripsForUser } from '@/lib/trip/actions'
import { TripList } from '@/components/trip/TripList'
import { CreateTripDialog } from '@/components/trip/CreateTripDialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const result = await getTripsForUser()

  if (!result.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{result.error}</p>
      </div>
    )
  }

  const allTrips = result.data
  const activeTrips = allTrips.filter((t) => t.status === 'active')
  const settledTrips = allTrips.filter((t) => t.status === 'settled')

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split('@')[0] ??
    'Adventurer'

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Welcome header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-bold tracking-wide sm:text-3xl">
              Welcome back, {displayName} ⚔️
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {activeTrips.length} active &nbsp;·&nbsp; {settledTrips.length} settled
            </p>
          </div>

          <CreateTripDialog>
            <Button
              className="
                shrink-0
                [box-shadow:0_3px_0_0_hsl(var(--primary)/0.6)]
                hover:-translate-y-px hover:[box-shadow:0_4px_0_0_hsl(var(--primary)/0.6)]
                active:translate-y-0.5 active:[box-shadow:0_1px_0_0_hsl(var(--primary)/0.6)]
                transition-all duration-75
              "
            >
              + New Quest
            </Button>
          </CreateTripDialog>
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              Active
              {activeTrips.length > 0 && (
                <span className="ml-1.5 rounded-full bg-[#FDCB6E] px-1.5 py-px text-[10px] font-bold text-foreground">
                  {activeTrips.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settled">Settled</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <TripList
              trips={activeTrips}
              emptyMessage="Start your first quest with the button above"
            />
          </TabsContent>

          <TabsContent value="settled">
            <TripList
              trips={settledTrips}
              emptyMessage="Settled quests will appear here"
            />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
