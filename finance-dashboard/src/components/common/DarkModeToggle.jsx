import { useDashboardStore } from '../../store/useDashboardStore'

function DarkModeToggle() {
  const theme = useDashboardStore((state) => state.theme)
  const toggleTheme = useDashboardStore((state) => state.toggleTheme)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}

export default DarkModeToggle
