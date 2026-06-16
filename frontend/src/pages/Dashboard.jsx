import { useEffect } from 'react'
import { ShieldCheck, UserCircle, Mail, CalendarDays } from 'lucide-react'
import ErrorMessage from '../components/ui/ErrorMessage'
import Loader from '../components/ui/Loader'
import PageHeader from '../components/common/PageHeader'
import { authService } from '../services/authService'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'

function Dashboard() {
  const { user } = useAuth()
  const { data, error, isLoading, execute } = useApi(authService.profile)

  useEffect(() => {
    execute().catch(() => {})
  }, [execute])

  const profile = data?.user || user

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Protected"
        title={`Welcome${profile?.name ? `, ${profile.name}` : ''}`}
        description="This dashboard retrieves your authenticated profile from the backend."
      />

      <div className="mt-8">
        {isLoading ? <Loader label="Loading dashboard" /> : null}
        {error ? <ErrorMessage message={error.message} /> : null}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <UserCircle className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            <p className="text-sm font-semibold">Profile</p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-950">Name:</span> {profile?.name || 'N/A'}
            </p>
            <p>
              <span className="font-semibold text-slate-950">Email:</span> {profile?.email || 'N/A'}
            </p>
            <p>
              <span className="font-semibold text-slate-950">Verified:</span>{' '}
              {profile?.isEmailVerified ? 'Yes' : 'No'}
            </p>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <Mail className="h-5 w-5 text-cyan-700" aria-hidden="true" />
            <p className="text-sm font-semibold">Contact</p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Email notifications are enabled for account recovery and login OTPs.</p>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-950">
            <CalendarDays className="h-5 w-5 text-violet-700" aria-hidden="true" />
            <p className="text-sm font-semibold">Joined</p>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <p>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </article>
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-slate-950">
          <ShieldCheck className="h-5 w-5 text-emerald-700" aria-hidden="true" />
          <p className="text-sm font-semibold">Secure access</p>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          This page is protected by a JWT bearer token and loads current user data from the backend profile endpoint.
        </p>
      </div>
    </section>
  )
}

export default Dashboard
