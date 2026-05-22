import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary'
  icon?: ReactNode
}

export function Button({
  variant,
  icon,
  children,
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3 font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'
  const variantClass =
    variant === 'primary' ? 'bg-brand hover:bg-brand-strong text-brand-ink' : ''

  return (
    <button type={type} className={`${base} ${variantClass} ${className}`.trim()} {...props}>
      {children}
      {icon}
    </button>
  )
}
