import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, UserPlus } from 'lucide-react'
import Button from '../ui/Button'
import { APP_NAME } from '../../constants/app'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'

const navLinkClass = ({ isActive }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition hover:bg-slate-100',
    isActive ? 'bg-slate-100 text-slate-950' : 'text-slate-600',
  )

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="text-base font-bold text-slate-950">
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink to={ROUTES.HOME} className={navLinkClass}>
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to={ROUTES.DASHBOARD} className={navLinkClass}>
                Dashboard
              </NavLink>
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={handleLogout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to={ROUTES.LOGIN} className={navLinkClass}>
                Login
              </NavLink>
              <Button variant="secondary" className="hidden sm:inline-flex" onClick={() => navigate(ROUTES.REGISTER)}>
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Register
              </Button>
            </>
          )}
          {isAuthenticated ? (
            <Button variant="ghost" className="sm:hidden" aria-label="Logout" onClick={handleLogout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button variant="ghost" className="sm:hidden" aria-label="Register" onClick={() => navigate(ROUTES.REGISTER)}>
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
