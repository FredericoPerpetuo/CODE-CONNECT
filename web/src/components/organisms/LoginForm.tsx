import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LoginFormData } from '../../types/auth'
import { Button } from '../atoms/Button'
import { TextLink } from '../atoms/TextLink'
import { ArrowRightIcon, ClipboardIcon } from '../atoms/icons'
import { FormField } from '../molecules/FormField'
import { Divider } from '../molecules/Divider'
import { RememberRow } from '../molecules/RememberRow'
import { SocialLoginGroup } from '../molecules/SocialLoginGroup'

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit?.({ identifier, password, remember })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-5 px-10 py-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-1">Login</h1>
        <p className="text-text-muted">Boas-vindas! Faça seu login.</p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          id="login-identifier"
          label="Email ou usuário"
          type="text"
          placeholder="usuario123"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <FormField
          id="login-password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <RememberRow checked={remember} onCheckedChange={setRemember} />

      <Button variant="primary" type="submit" icon={<ArrowRightIcon />}>
        Login
      </Button>

      <Divider>ou entre com outras contas</Divider>

      <SocialLoginGroup />

      <div className="flex flex-col items-center gap-1 mt-auto">
        <p className="text-sm text-text-muted">Ainda não tem conta?</p>
        <TextLink to="/cadastro" icon={<ClipboardIcon />} className="font-semibold">
          Crie seu cadastro!
        </TextLink>
      </div>
    </form>
  )
}
