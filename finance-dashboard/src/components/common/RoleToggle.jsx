import { useDashboardStore } from '../../store/useDashboardStore'

function RoleToggle() {
  const role = useDashboardStore((state) => state.role)
  const setRole = useDashboardStore((state) => state.setRole)

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
      <span className="font-medium text-slate-600 dark:text-slate-300">Role:</span>

      <button
        type="button"
        onClick={() => setRole('viewer')}
        className={`rounded-lg px-3 py-1 font-medium transition-colors ${
          role === 'viewer'
            ? 'bg-brand-500 text-white'
            : 'text-slate-500 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
      >
        Viewer
      </button>

      <button
        type="button"
        onClick={() => setRole('admin')}
        className={`rounded-lg px-3 py-1 font-medium transition-colors ${
          role === 'admin'
            ? 'bg-brand-500 text-white'
            : 'text-slate-500 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
      >
        Admin
      </button>
    </div>
  )
}

export default RoleToggle
