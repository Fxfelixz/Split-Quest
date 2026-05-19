export function formatMoney(amount: number): string {
  return `฿${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDateRange(
  start: string | null,
  end: string | null
): string {
  if (!start) return 'No dates set'

  const startDate = new Date(start)
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' })
  const startDay = startDate.getDate()
  const startYear = startDate.getFullYear()

  if (!end) {
    return `${startMonth} ${startDay}, ${startYear}`
  }

  const endDate = new Date(end)
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' })
  const endDay = endDate.getDate()
  const endYear = endDate.getFullYear()

  // Same month & year: "Mar 15 - 18, 2026"
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay} - ${endDay}, ${endYear}`
  }

  // Different month, same year: "Mar 28 - Apr 2, 2026"
  if (startYear === endYear) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`
  }

  // Different year: "Dec 30, 2025 - Jan 2, 2026"
  return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
}
