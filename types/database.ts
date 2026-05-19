export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          owner_id: string
          name: string
          cover_emoji: string | null
          status: 'active' | 'settled' | 'archived'
          started_at: string | null
          ended_at: string | null
          created_at: string
          settled_at: string | null
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          cover_emoji?: string | null
          status?: 'active' | 'settled' | 'archived'
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
          settled_at?: string | null
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          cover_emoji?: string | null
          status?: 'active' | 'settled' | 'archived'
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
          settled_at?: string | null
        }
      }
      trip_members: {
        Row: {
          trip_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          trip_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          trip_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      invites: {
        Row: {
          code: string
          trip_id: string
          created_by: string
          expires_at: string | null
          max_uses: number | null
          used_count: number
          created_at: string
        }
        Insert: {
          code: string
          trip_id: string
          created_by: string
          expires_at?: string | null
          max_uses?: number | null
          used_count?: number
          created_at?: string
        }
        Update: {
          code?: string
          trip_id?: string
          created_by?: string
          expires_at?: string | null
          max_uses?: number | null
          used_count?: number
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          trip_id: string
          payer_id: string
          title: string
          category: 'food' | 'drink' | 'transport' | 'accommodation' | 'entertainment' | 'shopping' | 'other'
          subtotal: number
          discount: number
          service_pct: number
          vat_pct: number
          final_amount: number
          split_type: 'equal' | 'custom_amount' | 'custom_percent' | 'by_shares'
          note: string | null
          occurred_at: string
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          payer_id: string
          title: string
          category?: 'food' | 'drink' | 'transport' | 'accommodation' | 'entertainment' | 'shopping' | 'other'
          subtotal: number
          discount?: number
          service_pct?: number
          vat_pct?: number
          final_amount: number
          split_type?: 'equal' | 'custom_amount' | 'custom_percent' | 'by_shares'
          note?: string | null
          occurred_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          payer_id?: string
          title?: string
          category?: 'food' | 'drink' | 'transport' | 'accommodation' | 'entertainment' | 'shopping' | 'other'
          subtotal?: number
          discount?: number
          service_pct?: number
          vat_pct?: number
          final_amount?: number
          split_type?: 'equal' | 'custom_amount' | 'custom_percent' | 'by_shares'
          note?: string | null
          occurred_at?: string
          created_at?: string
        }
      }
      expense_splits: {
        Row: {
          expense_id: string
          user_id: string
          share_amount: number
          share_meta: Json | null
        }
        Insert: {
          expense_id: string
          user_id: string
          share_amount: number
          share_meta?: Json | null
        }
        Update: {
          expense_id?: string
          user_id?: string
          share_amount?: number
          share_meta?: Json | null
        }
      }
      trip_summaries: {
        Row: {
          trip_id: string
          total_amount: number
          expense_count: number
          member_count: number
          duration_days: number | null
          member_stats: Json
          settlements: Json
          achievements: Json | null
          created_at: string
        }
        Insert: {
          trip_id: string
          total_amount: number
          expense_count: number
          member_count: number
          duration_days?: number | null
          member_stats: Json
          settlements: Json
          achievements?: Json | null
          created_at?: string
        }
        Update: {
          trip_id?: string
          total_amount?: number
          expense_count?: number
          member_count?: number
          duration_days?: number | null
          member_stats?: Json
          settlements?: Json
          achievements?: Json | null
          created_at?: string
        }
      }
    }
  }
}
