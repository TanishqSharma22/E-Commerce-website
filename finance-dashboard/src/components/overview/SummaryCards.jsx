import { useMemo } from 'react'
import { selectVisibleTransactions, useDashboardStore } from '../../store/useDashboardStore'

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)

function SummaryCards() {
  const visibleTransactions = useDashboardStore(selectVisibleTransactions)

  const cards = useMemo(() => {
    const totals = visibleTransactions.reduce(
      (accumulator, transaction) => {
        if (transaction.type === 'income') {
          accumulator.income += transaction.amount
        } else {
          accumulator.expenses += transaction.amount
        }

        return accumulator
      },
      { income: 0, expenses: 0 }
    )

    const balance = totals.income - totals.expenses

    return [
      {
        title: 'Total Balance',
        value: formatCurrency(balance),
        tone: balance >= 0 ? 'text-emerald-600' : 'text-rose-600'
      },
      { title: 'Income', value: formatCurrency(totals.income), tone: 'text-blue-600' },
      { title: 'Expenses', value: formatCurrency(totals.expenses), tone: 'text-rose-600' }
    ]
  }, [visibleTransactions])

  return (
    <section className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Overview</h2>
        <p className="text-xs text-slate-500 dark:text-slate-300">{visibleTransactions.length} visible transaction(s)</p>
      </div>

      {!visibleTransactions.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white p-6 text-center text-sm text-slate-500 dark:text-slate-300 shadow-sm">
          No transactions match current filters. Summary cards will update once data is available.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-300">{card.title}</p>
            <h2 className={`mt-2 text-2xl font-semibold ${card.tone}`}>{card.value}</h2>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SummaryCards
