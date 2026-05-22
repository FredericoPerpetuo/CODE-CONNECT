import { Checkbox } from '../atoms/Checkbox'

interface RememberRowProps {
  checked: boolean
  onCheckedChange: (value: boolean) => void
}

export function RememberRow({ checked, onCheckedChange }: RememberRowProps) {
  return (
    <div className="flex items-center justify-between">
      <Checkbox
        id="remember-me"
        label="Lembrar-me"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <button
        type="button"
        className="text-sm text-text-muted hover:text-text-primary underline transition-colors cursor-pointer"
      >
        Esqueci a senha
      </button>
    </div>
  )
}
