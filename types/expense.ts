import type { Database } from './database'

export type Expense = Database['public']['Tables']['expenses']['Row']
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert']
export type ExpenseSplit = Database['public']['Tables']['expense_splits']['Row']

export type ExpenseCategory = Expense['category']

export type ExpenseWithPayer = Expense & {
  payer_name: string | null
  payer_avatar: string | null
}

export type MemberBalance = {
  user_id: string
  display_name: string | null
  avatar_url: string | null
  paid: number
  owed: number
  net: number
}

export type SettleTransaction = {
  from_user_id: string
  from_name: string | null
  to_user_id: string
  to_name: string | null
  amount: number
}

export type TripBalances = {
  members: MemberBalance[]
  transactions: SettleTransaction[]
  total: number
}
