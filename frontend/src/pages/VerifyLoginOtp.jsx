import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'
import Input from '../components/ui/Input'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'

function VerifyLoginOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyLoginOtp } = useAuth()
  const [error, setError] = useState('')
  const defaultEmail = location.state?.email || ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: defaultEmail,
      otp: '',
    },
  })

  const onSubmit = async (values) => {
    setError('')
    try {
      await verifyLoginOtp(values)
      toast.success('Login verified successfully')
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (requestError) {
      const message = requestError.message || 'Unable to verify OTP'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <section className="mx-auto flex max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">Verify login</h1>
          <p className="mt-2 text-sm text-slate-600">Enter the OTP we sent to your email to complete sign in.</p>
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
            label="OTP code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            error={errors.otp?.message}
            {...register('otp', {
              required: 'OTP is required',
              minLength: { value: 6, message: 'OTP must be 6 digits' },
              maxLength: { value: 6, message: 'OTP must be 6 digits' },
            })}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Verify OTP
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Back to{' '}
          <button
            type="button"
            className="font-semibold text-slate-950 hover:underline"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Login
          </button>
        </p>
      </div>
    </section>
  )
}

export default VerifyLoginOtp
