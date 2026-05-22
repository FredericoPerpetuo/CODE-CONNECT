import { LogoMark } from '../atoms/icons'

export function BackgroundWatermark() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <LogoMark className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 text-text-primary opacity-[6%]" />
      <LogoMark className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 text-text-primary opacity-[6%]" />
    </div>
  )
}
