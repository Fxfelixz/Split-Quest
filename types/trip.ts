import type { Database } from './database'

export type Trip = Database['public']['Tables']['trips']['Row']
export type TripInsert = Database['public']['Tables']['trips']['Insert']

export type TripWithMembers = Trip & {
  members: Array<{
    user_id: string
    display_name: string | null
    avatar_url: string | null
  }>
  member_count: number
  total_amount?: number
  expense_count?: number
}
