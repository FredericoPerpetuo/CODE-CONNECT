import type { ButtonHTMLAttributes } from 'react'

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconSrc: string
  label: string
}

export function SocialButton({ iconSrc, label, className = '', ...props }: SocialButtonProps) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center gap-2 px-8 py-3 bg-surface-input rounded-lg border border-border-subtle hover:border-brand transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
      {...props}
    >
      <img src={iconSrc} alt="" className="w-8 h-8 object-contain" />
      <span className="text-sm text-text-muted">{label}</span>
    </button>
  )
}
