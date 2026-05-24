interface IconProps {
  className?: string
}

export function ArrowRightIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function ClipboardIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  )
}

export function LoginIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  )
}

export function LogoMark({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="8" y="8" width="84" height="42" rx="21" stroke="currentColor" strokeWidth="12" fill="none" />
      <rect x="8" y="30" width="40" height="80" rx="20" stroke="currentColor" strokeWidth="12" fill="none" />
      <rect x="8" y="90" width="84" height="42" rx="21" stroke="currentColor" strokeWidth="12" fill="none" />
    </svg>
  )
}
