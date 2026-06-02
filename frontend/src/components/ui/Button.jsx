import { LoaderCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-950',
  secondary:
    'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-500',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
}

function Button({
  as: Component = 'button',
  children,
  className,
  disabled,
  isLoading = false,
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const buttonProps = Component === 'button' ? { type, disabled: disabled || isLoading } : {}

  return (
    <Component
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      aria-disabled={Component !== 'button' && (disabled || isLoading) ? true : undefined}
      {...buttonProps}
      {...props}
    >
      {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </Component>
  )
}

export default Button
