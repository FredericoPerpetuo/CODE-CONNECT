import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
}

export function Checkbox({ id, label, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        className="w-4 h-4 rounded accent-brand cursor-pointer"
        {...props}
      />
      <label htmlFor={id} className="text-xs text-text-muted cursor-pointer select-none">
        {label}
      </label>
    </div>
  )
}
