import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { selectVisibleTransactions, useDashboardStore } from '../../store/useDashboardStore'

const PIE_COLORS = ['#6366f1', '#0ea5e9', '#14b8a6', '#f59e0b', '#f43f5e', '#8b5cf6']

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)

function buildBalanceTrendData(transactions) {
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))

  let runningBalance = 0

  return sorted.map((transaction) => {
    runningBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount

    return {
      date: new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      balance: runningBalance
    }
  })
}

function buildExpenseBreakdownData(transactions) {
  const expensesOnly = transactions.filter((transaction) => transaction.type === 'expense')

  const categoryTotals = expensesOnly.reduce((accumulator, transaction) => {
    accumulator[transaction.category] = (accumulator[transaction.category] || 0) + transaction.amount
    return accumulator
  }, {})

  return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))
}

function EmptyChartState({ message }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-4 text-center text-sm text-slate-400">
      {message}
    </div>
  )
}

function BalanceTrendChart({ data }) {
  if (!data.length) {
    return <EmptyChartState message="No transactions found to calculate balance trend." />
  }

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={formatCurrency} width={72} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Line type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function ExpenseBreakdownChart({ data }) {
  if (!data.length) {
    return <EmptyChartState message="No expense transactions available for category breakdown." />
  }

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={96}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function ChartsPanel() {
  const transactions = useDashboardStore(selectVisibleTransactions)

  const balanceTrendData = buildBalanceTrendData(transactions)
  const expenseBreakdownData = buildExpenseBreakdownData(transactions)

  return (
    <section className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-300">Charts respond to active filters</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <h3 className="text-base font-semibold">Balance Trend</h3>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">Running balance over time from transaction history.</p>
          <BalanceTrendChart data={balanceTrendData} />
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <h3 className="text-base font-semibold">Expense Breakdown</h3>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">Expense totals grouped by category.</p>
          <ExpenseBreakdownChart data={expenseBreakdownData} />
        </article>
      </div>
    </section>
  )
}

export default ChartsPanel
