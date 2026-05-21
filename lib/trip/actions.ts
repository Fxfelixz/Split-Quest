'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Trip, TripWithMembers } from '@/types/trip'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

// ─── getTripsForUser ──────────────────────────────────────────────
// ดึง trips ทั้งหมดที่ user เป็น member พร้อม avatar/name ของแต่ละ member
// RLS จะ filter ให้อัตโนมัติ — user เห็นแค่ trip ที่ตัวเองอยู่
export async function getTripsForUser(): Promise<ActionResult<TripWithMembers[]>> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        trip_members(
          user_id,
          profiles(display_name, avatar_url)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) return { success: false, error: error.message }

    const trips: TripWithMembers[] = (data ?? []).map(trip => ({
      ...trip,
      members: (trip.trip_members ?? []).map((tm: {
        user_id: string
        profiles: { display_name: string | null; avatar_url: string | null } | null
      }) => ({
        user_id: tm.user_id,
        display_name: tm.profiles?.display_name ?? null,
        avatar_url: tm.profiles?.avatar_url ?? null,
      })),
      member_count: (trip.trip_members ?? []).length,
    }))

    return { success: true, data: trips }
  } catch {
    return { success: false, error: 'Failed to load trips' }
  }
}

// ─── createTrip ───────────────────────────────────────────────────
// สร้าง trip ใหม่ — trigger on_trip_created จะ auto-add owner เป็น member
export async function createTrip(input: {
  name: string
  cover_emoji?: string
  started_at?: string
  ended_at?: string
}): Promise<ActionResult<Trip>> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const name = input.name.trim()
    if (!name) return { success: false, error: 'Quest name is required' }
    if (name.length > 100) return { success: false, error: 'Quest name must be 100 characters or less' }

    // Insert without .select() to avoid PostgREST applying SELECT RLS
    // before the trigger has added the owner to trip_members.
    const { error: insertError } = await supabase
      .from('trips')
      .insert({
        owner_id: user.id,
        name,
        cover_emoji: input.cover_emoji ?? '🎒',
        started_at: input.started_at ?? null,
        ended_at: input.ended_at ?? null,
      })

    if (insertError) return { success: false, error: insertError.message }

    // Fetch the newly created trip in a separate query.
    // By this point the trigger has committed the owner into trip_members,
    // so the SELECT RLS (is_trip_member) will pass.
    const { data, error: selectError } = await supabase
      .from('trips')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (selectError) return { success: false, error: selectError.message }

    revalidatePath('/dashboard')
    return { success: true, data }
  } catch {
    return { success: false, error: 'Failed to create trip' }
  }
}
