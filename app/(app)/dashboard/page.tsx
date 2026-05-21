import { getTripsForUser } from '@/lib/trip/actions'
import { TripList } from '@/components/trip/TripList'
import { CreateTripDialog } from '@/components/trip/CreateTripDialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function DashboardPage() {
  const result = await getTripsForUser()

  if (!result.success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">{result.error}</p>
      </div>
    )
  }

  const allTrips = result.data
  const activeTrips = allTrips.filter((t) => t.status === 'active')
  const settledTrips = allTrips.filter((t) => t.status === 'settled')

  return (
    <>
      {/* ── Topbar ── */}
      <div className="app-topbar">
        <div className="app-crumb">
          <span>Dashboard</span>
        </div>
        <CreateTripDialog>
          <button className="dash-btn-primary">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            New quest
          </button>
        </CreateTripDialog>
      </div>

      {/* ── Content ── */}
      <div className="app-content">
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
              emptyMessage="Start your first quest — click New quest above"
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
    </>
  )
}
