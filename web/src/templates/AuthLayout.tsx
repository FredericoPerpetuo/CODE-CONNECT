import type { ReactNode } from 'react'
import { BackgroundWatermark } from '../components/organisms/BackgroundWatermark'

interface AuthLayoutProps {
  banner: {
    src: string
    alt: string
  }
  children: ReactNode
}

export function AuthLayout({ banner, children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-surface-base px-4 py-8">
      <BackgroundWatermark />
      <div className="relative z-10 flex rounded-3xl overflow-hidden w-full max-w-4xl bg-surface-card shadow-2xl">
        <div className="w-[45%] flex-shrink-0">
          <img src={banner.src} alt={banner.alt} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    </main>
  )
}
