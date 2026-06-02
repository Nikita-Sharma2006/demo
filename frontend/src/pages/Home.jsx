import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import Button from '../components/ui/Button'
import PageHeader from '../components/common/PageHeader'
import { ROUTES } from '../constants/routes'

const features = [
  {
    title: 'Production structure',
    description: 'Routes, services, hooks, constants, and reusable components are separated by responsibility.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast developer flow',
    description: 'Vite, Tailwind CSS, and React 19 keep iteration quick without sacrificing maintainability.',
    icon: Zap,
  },
  {
    title: 'Ready for APIs',
    description: 'Axios interceptors, auth persistence, protected routes, and error states are already wired.',
    icon: CheckCircle2,
  },
]

function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <PageHeader
            eyebrow="React 19 frontend"
            title="A clean foundation for secure, scalable web apps."
            description="Start with a complete frontend architecture that includes routing, authentication flow, API boundaries, form handling, notifications, and responsive UI primitives."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to={ROUTES.REGISTER} className="w-full sm:w-auto">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button as={Link} to={ROUTES.LOGIN} variant="secondary" className="w-full sm:w-auto">
              Sign in
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="rounded-md bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-slate-300">Frontend status</p>
                <p className="mt-1 text-2xl font-bold">Ready</p>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-200">
                Live
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="rounded-md bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-1 h-5 w-5 text-emerald-300" aria-hidden="true" />
                      <div>
                        <h2 className="text-sm font-semibold">{feature.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Home
