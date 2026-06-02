import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import Button from '../components/ui/Button'
import { ROUTES } from '../constants/routes'

function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">404</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Page not found</h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button as={Link} to={ROUTES.HOME} className="mt-8">
        <Home className="h-4 w-4" aria-hidden="true" />
        Back home
      </Button>
    </section>
  )
}

export default NotFound
