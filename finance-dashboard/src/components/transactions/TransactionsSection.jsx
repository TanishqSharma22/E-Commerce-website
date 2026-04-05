import { useState } from 'react'
import { selectVisibleTransactions, useDashboardStore } from '../../store/useDashboardStore'

const sortOptions = [
  { label: 'Date (Newest)', value: 'date-desc' },
  { label: 'Date (Oldest)', value: 'date-asc' },
  { label: 'Amount (High to Low)', value: 'amount-desc' },
  { label: 'Amount (Low to High)', value: 'amount-asc' }
]

const typeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' }
]

const entryTypes = [
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' }
]

const createDefaultForm = () => ({
  id: null,
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  category: '',
  type: 'expense'
})

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

function TransactionModal({ form, setForm, mode, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800 dark:text-slate-100">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold">{mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}</h4>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">Date</span>
            <input
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              type="date"
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 outline-none ring-brand-500 focus:ring dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">Amount</span>
            <input
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 outline-none ring-brand-500 focus:ring dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">Category</span>
            <input
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              type="text"
              placeholder="Category"
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 outline-none ring-brand-500 focus:ring dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">Type</span>
            <select
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 outline-none ring-brand-500 focus:ring dark:bg-slate-900 dark:text-slate-100"
            >
              {entryTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            {mode === 'add' ? 'Add' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}

function TransactionsSection() {
  const role = useDashboardStore((state) => state.role)
  const filters = useDashboardStore((state) => state.filters)
  const setFilters = useDashboardStore((state) => state.setFilters)
  const resetFilters = useDashboardStore((state) => state.resetFilters)
  const addTransaction = useDashboardStore((state) => state.addTransaction)
  const updateTransaction = useDashboardStore((state) => state.updateTransaction)

  const [modalMode, setModalMode] = useState(null)
  const [modalForm, setModalForm] = useState(createDefaultForm())

  const isAdmin = role === 'admin'

  const visibleTransactions = useDashboardStore(selectVisibleTransactions)

  const closeModal = () => {
    setModalMode(null)
    setModalForm(createDefaultForm())
  }

  const openAddModal = () => {
    if (!isAdmin) {
      return
    }

    setModalMode('add')
    setModalForm(createDefaultForm())
  }

  const openEditModal = (transaction) => {
    if (!isAdmin) {
      return
    }

    setModalMode('edit')
    setModalForm({
      id: transaction.id,
      date: transaction.date,
      amount: String(transaction.amount),
      category: transaction.category,
      type: transaction.type
    })
  }

  const saveModalTransaction = () => {
    if (!isAdmin || !modalForm.category.trim() || Number(modalForm.amount) <= 0) {
      return
    }

    const payload = {
      date: modalForm.date,
      amount: Number(modalForm.amount),
      category: modalForm.category.trim(),
      type: modalForm.type
    }

    if (modalMode === 'add') {
      addTransaction(payload)
    }

    if (modalMode === 'edit' && modalForm.id) {
      updateTransaction({ id: modalForm.id, ...payload })
    }

    closeModal()
  }

  return (
    <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:p-5 dark:text-slate-100">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold">Transactions</h3>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openAddModal}
            disabled={!isAdmin}
            title={!isAdmin ? 'Viewer role cannot add transactions' : ''}
            className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Add Transaction
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:bg-slate-900/50"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {!isAdmin ? (
        <p className="mb-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-xs text-slate-500 dark:text-slate-300">
          Viewer mode: add/edit actions are disabled.
        </p>
      ) : null}

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-600 dark:text-slate-300">Search by Category</span>
          <input
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
            type="text"
            placeholder="e.g. Groceries"
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 outline-none ring-brand-500 focus:ring dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-600 dark:text-slate-300">Filter by Type</span>
          <select
            value={filters.type}
            onChange={(event) => setFilters({ type: event.target.value })}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 outline-none ring-brand-500 focus:ring dark:bg-slate-900 dark:text-slate-100"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-600 dark:text-slate-300">Sort</span>
          <select
            value={filters.sortBy}
            onChange={(event) => setFilters({ sortBy: event.target.value })}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 outline-none ring-brand-500 focus:ring dark:bg-slate-900 dark:text-slate-100"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!visibleTransactions.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center text-sm text-slate-400">
          No transactions matched your current search/filter.
        </div>
      ) : (
        <>
          <div className="space-y-3 sm:hidden">
            {visibleTransactions.map((transaction) => (
              <article key={transaction.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{transaction.category}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      transaction.type === 'income'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-300">{formatDate(transaction.date)}</p>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <button
                  type="button"
                  onClick={() => openEditModal(transaction)}
                  disabled={!isAdmin}
                  title={!isAdmin ? 'Viewer role cannot edit transactions' : ''}
                  className="mt-3 w-full rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  Edit
                </button>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Amount</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{formatDate(transaction.date)}</td>
                    <td
                      className={`py-3 pr-4 font-medium ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-3 pr-4 text-slate-700 dark:text-slate-200">{transaction.category}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          transaction.type === 'income'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(transaction)}
                        disabled={!isAdmin}
                        title={!isAdmin ? 'Viewer role cannot edit transactions' : ''}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modalMode ? (
        <TransactionModal
          form={modalForm}
          setForm={setModalForm}
          mode={modalMode}
          onClose={closeModal}
          onSave={saveModalTransaction}
        />
      ) : null}
    </section>
  )
}

export default TransactionsSection
