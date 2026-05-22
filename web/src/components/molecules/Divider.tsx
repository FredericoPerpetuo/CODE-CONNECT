import type { ReactNode } from 'react'

interface DividerProps {
  children: ReactNode
}

export function Divider({ children }: DividerProps) {
  return (
    <div className="flex items-center gap-3 text-text-muted text-sm">
      <div className="flex-1 h-px bg-border-subtle" />
      <span>{children}</span>
      <div className="flex-1 h-px bg-border-subtle" />
    </div>
  )
}
