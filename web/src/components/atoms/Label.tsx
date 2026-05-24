import type { LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string
}

export function Label({ htmlFor, children, className = '', ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-medium text-text-muted mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
