import { useEffect } from 'react'
import DashboardLayout from './components/layout/DashboardLayout'
import RoleToggle from './components/common/RoleToggle'
import DarkModeToggle from './components/common/DarkModeToggle'
import SummaryCards from './components/overview/SummaryCards'
import ChartsPanel from './components/overview/ChartsPanel'
import TransactionsSection from './components/transactions/TransactionsSection'
import InsightsSection from './components/insights/InsightsSection'
import { useDashboardStore } from './store/useDashboardStore'

function App() {
  const role = useDashboardStore((state) => state.role)
  const theme = useDashboardStore((state) => state.theme)
  const filters = useDashboardStore((state) => state.filters)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <DashboardLayout>
      <header className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Finance Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Active role: <span className="font-medium capitalize">{role}</span> · Active filters:{' '}
            <span className="font-medium">{filters.type}</span>
            {filters.search ? ` / ${filters.search}` : ''}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-400">
            All cards, charts, insights, and transactions update from global Zustand state.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DarkModeToggle />
          <RoleToggle />
        </div>
      </header>

      <SummaryCards />
      <ChartsPanel />
      <TransactionsSection />
      <InsightsSection />
    </DashboardLayout>
  )
}

export default App
