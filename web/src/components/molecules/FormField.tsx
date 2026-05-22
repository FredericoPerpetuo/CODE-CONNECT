import type { InputHTMLAttributes } from 'react'
import { Label } from '../atoms/Label'
import { TextInput } from '../atoms/TextInput'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
}

export function FormField({ id, label, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <TextInput id={id} {...props} />
    </div>
  )
}
