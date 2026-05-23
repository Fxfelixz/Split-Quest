'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ExpenseCategory, ExpenseWithPayer, MemberBalance, SettleTransaction, TripBalances } from '@/types/expense'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

type TripMember = {
  user_id: string
  display_name: string | null
  avatar_url: string | null
}

export type SplitMode = 'equal' | 'exact' | 'percent'

export async function addExpense(input: {
  trip_id: string
  payer_id: string
  title: string
  category: ExpenseCategory
  amount: number
  split_mode: SplitMode
  member_ids: string[]
  custom_shares?: Record<string, number>  // amount (exact) or percent (percent)
}): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { trip_id, payer_id, title, category, amount, split_mode, member_ids, custom_shares } = input
    if (!title.trim()) return { success: false, error: 'Title is required' }
    if (amount <= 0) return { success: false, error: 'Amount must be greater than 0' }
    if (!member_ids.length) return { success: false, error: 'Select at least one member' }

    // Validate member_ids are actual trip members
    const { data: tripMembers, error: membersError } = await supabase
      .from('trip_members')
      .select('user_id')
      .eq('trip_id', trip_id)

    if (membersError || !tripMembers?.length) {
      return { success: false, error: 'Failed to load trip members' }
    }

    const validIds = new Set(tripMembers.map(m => m.user_id))
    if (member_ids.some(id => !validIds.has(id))) {
      return { success: false, error: 'Invalid member selection' }
    }

    const dbSplitType = split_mode === 'equal'
      ? 'equal'
      : split_mode === 'exact'
        ? 'custom_amount'
        : 'custom_percent'

    const { data: expense, error: expenseError } = await supabase
      .from('expenses')
      .insert({
        trip_id,
        payer_id,
        title: title.trim(),
        category,
        subtotal: amount,
        discount: 0,
        service_pct: 0,
        vat_pct: 0,
        final_amount: amount,
        split_type: dbSplitType,
      })
      .select('id')
      .single()

    if (expenseError || !expense) {
      return { success: false, error: expenseError?.message ?? 'Failed to create expense' }
    }

    // Build splits based on mode
    type SplitRow = { expense_id: string; user_id: string; share_amount: number; share_meta: { percent: number } | null }
    let splits: SplitRow[]

    if (split_mode === 'equal') {
      const count = member_ids.length
      const baseShare = Math.floor((amount * 100) / count) / 100
      const remainder = Math.round((amount - baseShare * count) * 100) / 100
      splits = member_ids.map((id, i) => ({
        expense_id: expense.id,
        user_id: id,
        share_amount: i === 0 ? baseShare + remainder : baseShare,
        share_meta: null,
      }))
    } else if (split_mode === 'exact') {
      splits = member_ids.map(id => ({
        expense_id: expense.id,
        user_id: id,
        share_amount: Math.round((custom_shares?.[id] ?? 0) * 100) / 100,
        share_meta: null,
      }))
    } else {
      splits = member_ids.map(id => {
        const pct = custom_shares?.[id] ?? 0
        return {
          expense_id: expense.id,
          user_id: id,
          share_amount: Math.round((amount * pct / 100) * 100) / 100,
          share_meta: { percent: pct },
        }
      })
    }

    const { error: splitsError } = await supabase
      .from('expense_splits')
      .insert(splits)

    if (splitsError) return { success: false, error: splitsError.message }

    revalidatePath(`/trip/${trip_id}`)
    return { success: true, data: { id: expense.id } }
  } catch {
    return { success: false, error: 'Failed to add expense' }
  }
}

export async function getExpensesForTrip(
  tripId: string
): Promise<ActionResult<ExpenseWithPayer[]>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('occurred_at', { ascending: false })

    if (error) return { success: false, error: error.message }

    const payerIds = [...new Set((expenses ?? []).map(e => e.payer_id))]
    let profileMap: Record<string, { display_name: string | null; avatar_url: string | null }> = {}

    if (payerIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', payerIds)

      profileMap = Object.fromEntries(
        (profiles ?? []).map(p => [p.id, { display_name: p.display_name, avatar_url: p.avatar_url }])
      )
    }

    const result: ExpenseWithPayer[] = (expenses ?? []).map(e => ({
      ...e,
      payer_name: profileMap[e.payer_id]?.display_name ?? null,
      payer_avatar: profileMap[e.payer_id]?.avatar_url ?? null,
    }))

    return { success: true, data: result }
  } catch {
    return { success: false, error: 'Failed to load expenses' }
  }
}

export async function getTripBalances(
  tripId: string,
  members: TripMember[]
): Promise<ActionResult<TripBalances>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { data: expenses, error: expError } = await supabase
      .from('expenses')
      .select('id, payer_id, final_amount')
      .eq('trip_id', tripId)

    if (expError) return { success: false, error: expError.message }

    if (!expenses?.length) {
      const balances: MemberBalance[] = members.map(m => ({ ...m, paid: 0, owed: 0, net: 0 }))
      return { success: true, data: { members: balances, transactions: [], total: 0 } }
    }

    const expenseIds = expenses.map(e => e.id)
    const { data: splits, error: splitError } = await supabase
      .from('expense_splits')
      .select('expense_id, user_id, share_amount')
      .in('expense_id', expenseIds)

    if (splitError) return { success: false, error: splitError.message }

    const paid: Record<string, number> = {}
    const owed: Record<string, number> = {}

    for (const exp of expenses) {
      paid[exp.payer_id] = (paid[exp.payer_id] ?? 0) + exp.final_amount
    }
    for (const split of (splits ?? [])) {
      owed[split.user_id] = (owed[split.user_id] ?? 0) + split.share_amount
    }

    const total = expenses.reduce((sum, e) => sum + e.final_amount, 0)

    const balances: MemberBalance[] = members.map(m => {
      const p = paid[m.user_id] ?? 0
      const o = owed[m.user_id] ?? 0
      return { ...m, paid: p, owed: o, net: Math.round((p - o) * 100) / 100 }
    })

    const transactions = minimizeTransactions(balances)
    return { success: true, data: { members: balances, transactions, total } }
  } catch {
    return { success: false, error: 'Failed to calculate balances' }
  }
}

function minimizeTransactions(balances: MemberBalance[]): SettleTransaction[] {
  const creditors = balances
    .filter(b => b.net > 0.01)
    .map(b => ({ ...b }))
    .sort((a, b) => b.net - a.net)

  const debtors = balances
    .filter(b => b.net < -0.01)
    .map(b => ({ ...b }))
    .sort((a, b) => a.net - b.net)

  const transactions: SettleTransaction[] = []
  let ci = 0
  let di = 0

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci]
    const debtor = debtors[di]
    const amount = Math.round(Math.min(creditor.net, -debtor.net) * 100) / 100

    if (amount > 0.01) {
      transactions.push({
        from_user_id: debtor.user_id,
        from_name: debtor.display_name,
        to_user_id: creditor.user_id,
        to_name: creditor.display_name,
        amount,
      })
    }

    creditor.net = Math.round((creditor.net - amount) * 100) / 100
    debtor.net = Math.round((debtor.net + amount) * 100) / 100

    if (Math.abs(creditor.net) < 0.01) ci++
    if (Math.abs(debtor.net) < 0.01) di++
  }

  return transactions
}
