import { formatMoney } from '@/lib/utils/format'
import type { ExpenseWithPayer } from '@/types/expense'

const CAT_EMOJI: Record<string, string> = {
  food: '🍽️',
  drink: '🍹',
  transport: '🚗',
  accommodation: '🏨',
  entertainment: '🎭',
  shopping: '🛍️',
  other: '📦',
}

function formatLocalDate(isoStr: string): string {
  const [year, month, day] = isoStr.slice(0, 10).split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

type Props = {
  expenses: ExpenseWithPayer[]
}

export function ExpenseList({ expenses }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="trip-empty-state">
        <span className="trip-empty-icon">📜</span>
        <p className="trip-empty-text">No expenses logged yet</p>
        <p className="trip-empty-sub">Hit &ldquo;Add expense&rdquo; to start tracking</p>
      </div>
    )
  }

  const grouped: Array<{ date: string; items: ExpenseWithPayer[] }> = []
  let currentDate = ''

  for (const exp of expenses) {
    const day = exp.occurred_at.slice(0, 10)
    if (day !== currentDate) {
      currentDate = day
      grouped.push({ date: day, items: [] })
    }
    grouped[grouped.length - 1].items.push(exp)
  }

  return (
    <div className="timeline-feed">
      {grouped.map(({ date, items }) => (
        <div key={date} className="timeline-group">
          <div className="timeline-date">{formatLocalDate(date)}</div>
          {items.map((exp) => (
            <div key={exp.id} className="timeline-card">
              <div className={`expense-cat ${exp.category}`}>
                {CAT_EMOJI[exp.category] ?? '📦'}
              </div>
              <div>
                <div className="expense-title">{exp.title}</div>
                <div className="expense-payer">{exp.payer_name ?? 'Hero'}</div>
              </div>
              <div className="expense-amount">{formatMoney(exp.final_amount)}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
