function DashboardLayout({ children }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl p-3 sm:p-5 lg:p-8">
      <div className="space-y-6">{children}</div>
    </main>
  )
}

export default DashboardLayout
