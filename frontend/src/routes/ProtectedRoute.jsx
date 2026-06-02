import { Navigate, useLocation } from 'react-router-dom'
import Loader from '../components/ui/Loader'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) {
    return <Loader label="Checking access" />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
