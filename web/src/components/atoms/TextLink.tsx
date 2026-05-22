import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface TextLinkProps {
  to: string
  children: ReactNode
  underline?: boolean
  icon?: ReactNode
  className?: string
}

export function TextLink({
  to,
  children,
  underline = false,
  icon,
  className = '',
}: TextLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1 text-brand hover:text-brand-strong transition-colors ${underline ? 'underline' : ''} ${className}`}
    >
      {children}
      {icon}
    </Link>
  )
}
