import { useMemo } from 'react'
import { selectVisibleTransactions, useDashboardStore } from '../../store/useDashboardStore'

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)

function getHighestSpendingCategory(expenses) {
  const totalsByCategory = expenses.reduce((accumulator, transaction) => {
    accumulator[transaction.category] = (accumulator[transaction.category] || 0) + transaction.amount
    return accumulator
  }, {})

  const [category, total] = Object.entries(totalsByCategory).sort((a, b) => b[1] - a[1])[0] || []

  if (!category) {
    return null
  }

  return { category, total }
}

function getMonthlyExpenses(expenses) {
  const totalsByMonth = expenses.reduce((accumulator, transaction) => {
    const monthKey = transaction.date.slice(0, 7)
    accumulator[monthKey] = (accumulator[monthKey] || 0) + transaction.amount
    return accumulator
  }, {})

  return Object.entries(totalsByMonth)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => new Date(`${a.month}-01`) - new Date(`${b.month}-01`))
}

function formatMonth(monthKey) {
  return new Date(`${monthKey}-01`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

function InsightsSection() {
  const transactions = useDashboardStore(selectVisibleTransactions)

  const { highestCategoryInsight, monthlyComparisonInsight, observationInsight } = useMemo(() => {
    const expenses = transactions.filter((transaction) => transaction.type === 'expense')

    if (!expenses.length) {
      return {
        highestCategoryInsight: 'No expense data available yet, so highest spending category cannot be determined.',
        monthlyComparisonInsight: 'Monthly expense comparison is unavailable because there are no expense transactions.',
        observationInsight: 'Add expense transactions to unlock trend-based insights.'
      }
    }

    const highestCategory = getHighestSpendingCategory(expenses)
    const monthlyExpenses = getMonthlyExpenses(expenses)

    const highestCategoryInsight = highestCategory
      ? `You spent the most on ${highestCategory.category}, totaling ${formatCurrency(highestCategory.total)}.`
      : 'Highest spending category could not be calculated from the current data.'

    let monthlyComparisonInsight = 'At least two months of expense data are needed for month-over-month comparison.'

    if (monthlyExpenses.length >= 2) {
      const currentMonth = monthlyExpenses[monthlyExpenses.length - 1]
      const previousMonth = monthlyExpenses[monthlyExpenses.length - 2]
      const difference = currentMonth.total - previousMonth.total
      const percentChange = previousMonth.total === 0 ? 0 : (difference / previousMonth.total) * 100

      if (difference > 0) {
        monthlyComparisonInsight = `${formatMonth(currentMonth.month)} expenses increased by ${Math.abs(percentChange).toFixed(1)}% compared to ${formatMonth(previousMonth.month)} (${formatCurrency(currentMonth.total)} vs ${formatCurrency(previousMonth.total)}).`
      } else if (difference < 0) {
        monthlyComparisonInsight = `${formatMonth(currentMonth.month)} expenses decreased by ${Math.abs(percentChange).toFixed(1)}% compared to ${formatMonth(previousMonth.month)} (${formatCurrency(currentMonth.total)} vs ${formatCurrency(previousMonth.total)}).`
      } else {
        monthlyComparisonInsight = `${formatMonth(currentMonth.month)} expenses were unchanged from ${formatMonth(previousMonth.month)} at ${formatCurrency(currentMonth.total)}.`
      }
    }

    const averageExpense = expenses.reduce((sum, transaction) => sum + transaction.amount, 0) / expenses.length
    const largestExpense = expenses.reduce((largest, transaction) =>
      transaction.amount > largest.amount ? transaction : largest
    )

    const observationInsight = `Your average expense transaction is ${formatCurrency(averageExpense)}. The single largest expense was ${formatCurrency(largestExpense.amount)} in ${largestExpense.category}.`

    return {
      highestCategoryInsight,
      monthlyComparisonInsight,
      observationInsight
    }
  }, [transactions])

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:p-5">
      <h3 className="mb-3 text-base font-semibold">Insights</h3>

      <ul className="list-inside list-disc space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
        <li>{highestCategoryInsight}</li>
        <li>{monthlyComparisonInsight}</li>
        <li>{observationInsight}</li>
      </ul>
    </section>
  )
}

export default InsightsSection
