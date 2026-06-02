import { useEffect } from 'react'
import { Activity, CalendarDays, ShieldCheck, Users } from 'lucide-react'
import ErrorMessage from '../components/ui/ErrorMessage'
import Loader from '../components/ui/Loader'
import PageHeader from '../components/common/PageHeader'
import { dashboardService } from '../services/dashboardService'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'

const fallbackStats = [
  { label: 'Active users', value: '1,284', icon: Users },
  { label: 'System uptime', value: '99.9%', icon: Activity },
  { label: 'Protected routes', value: 'Enabled', icon: ShieldCheck },
  { label: 'Last update', value: 'Today', icon: CalendarDays },
]

function Dashboard() {
  const { user } = useAuth()
  const { data, error, isLoading, execute } = useApi(dashboardService.getSummary)

  useEffect(() => {
    execute().catch(() => {})
  }, [execute])

  const stats = data?.stats || fallbackStats

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Protected"
        title={`Welcome${user?.name ? `, ${user.name}` : ''}`}
        description="This dashboard is guarded by the protected route wrapper and ready to consume authenticated API responses."
      />

      <div className="mt-8">
        {isLoading ? <Loader label="Loading dashboard" /> : null}
        {error ? <ErrorMessage message={error.message} /> : null}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon || Activity
          return (
            <article key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              <p className="mt-4 text-sm text-slate-500">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{item.value}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Dashboard
