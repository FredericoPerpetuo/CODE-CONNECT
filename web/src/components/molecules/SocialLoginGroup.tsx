import { SocialButton } from './SocialButton'

export function SocialLoginGroup() {
  return (
    <div className="flex gap-4 justify-center">
      <SocialButton iconSrc="/github.png" label="Github" />
      <SocialButton iconSrc="/gmail.png" label="Gmail" />
    </div>
  )
}
