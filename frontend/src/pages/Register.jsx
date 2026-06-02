import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'
import Input from '../components/ui/Input'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'

function Register() {
  const { register: registerAccount } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values) => {
    setError('')
    try {
      await registerAccount({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      navigate(ROUTES.LOGIN)
    } catch (requestError) {
      const message = requestError.message || 'Unable to create account'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <section className="mx-auto flex max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">Register</h1>
          <p className="mt-2 text-sm text-slate-600">Create an account to access protected routes.</p>
        </div>

        {error ? <div className="mb-5"><ErrorMessage message={error} /></div> : null}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
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
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value, formValues) =>
                value === formValues.password || 'Passwords do not match',
            })}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-semibold text-slate-950 hover:underline" to={ROUTES.LOGIN}>
            Sign in
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Register
