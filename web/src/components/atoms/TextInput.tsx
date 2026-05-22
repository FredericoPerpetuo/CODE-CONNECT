import type { InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
}

export function TextInput({ id, className = '', ...props }: TextInputProps) {
  return (
    <input
      id={id}
      className={`w-full rounded-lg bg-surface-input border border-border-subtle px-4 py-3 text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-shadow ${className}`}
      {...props}
    />
  )
}
