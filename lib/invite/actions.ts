'use server'

import { randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type Invite = Database['public']['Tables']['invites']['Row']
type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function createInvite(
  tripId: string
): Promise<ActionResult<Invite>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const code = randomBytes(6).toString('base64url').slice(0, 8).toUpperCase()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { data, error } = await supabase
      .from('invites')
      .insert({
        code,
        trip_id: tripId,
        created_by: user.id,
        expires_at: expiresAt.toISOString(),
        max_uses: null,
      })
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch {
    return { success: false, error: 'Failed to create invite' }
  }
}

export type InviteInfo = {
  invite: Invite
  trip: {
    id: string
    name: string
    cover_emoji: string | null
    member_count: number
  }
}

export async function getInviteInfo(
  code: string
): Promise<ActionResult<InviteInfo>> {
  try {
    const supabase = await createClient()

    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('*')
      .eq('code', code)
      .single()

    if (inviteError || !invite) {
      return { success: false, error: 'Invite not found' }
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return { success: false, error: 'This invite has expired' }
    }

    if (invite.max_uses !== null && invite.used_count >= invite.max_uses) {
      return { success: false, error: 'This invite has reached its maximum uses' }
    }

    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, name, cover_emoji')
      .eq('id', invite.trip_id)
      .single()

    if (tripError || !trip) {
      return { success: false, error: 'Trip not found' }
    }

    const { count } = await supabase
      .from('trip_members')
      .select('*', { count: 'exact', head: true })
      .eq('trip_id', invite.trip_id)

    return {
      success: true,
      data: { invite, trip: { ...trip, member_count: count ?? 0 } },
    }
  } catch {
    return { success: false, error: 'Failed to load invite' }
  }
}

export async function joinTripByInvite(
  code: string
): Promise<ActionResult<{ trip_id: string }>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('*')
      .eq('code', code)
      .single()

    if (inviteError || !invite) {
      return { success: false, error: 'Invite not found' }
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return { success: false, error: 'This invite has expired' }
    }

    if (invite.max_uses !== null && invite.used_count >= invite.max_uses) {
      return { success: false, error: 'This invite has reached its maximum uses' }
    }

    // Already a member — idempotent
    const { data: existing } = await supabase
      .from('trip_members')
      .select('user_id')
      .eq('trip_id', invite.trip_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!existing) {
      const { error: joinError } = await supabase
        .from('trip_members')
        .insert({ trip_id: invite.trip_id, user_id: user.id })

      if (joinError) return { success: false, error: joinError.message }

      await supabase
        .from('invites')
        .update({ used_count: invite.used_count + 1 })
        .eq('code', code)
    }

    revalidatePath('/dashboard')
    revalidatePath(`/trip/${invite.trip_id}`)
    return { success: true, data: { trip_id: invite.trip_id } }
  } catch {
    return { success: false, error: 'Failed to join trip' }
  }
}
