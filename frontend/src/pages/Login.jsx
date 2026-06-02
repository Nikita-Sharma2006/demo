import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'
import Input from '../components/ui/Input'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    setError('')
    try {
      await login(values)
      navigate(from, { replace: true })
    } catch (requestError) {
      const message = requestError.message || 'Unable to sign in'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <section className="mx-auto flex max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">Login</h1>
          <p className="mt-2 text-sm text-slate-600">Access your dashboard and account tools.</p>
        </div>

        {error ? <div className="mb-5"><ErrorMessage message={error} /></div> : null}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{' '}
          <Link className="font-semibold text-slate-950 hover:underline" to={ROUTES.REGISTER}>
            Create an account
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Login
