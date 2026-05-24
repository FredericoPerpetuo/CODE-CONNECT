import { useState } from 'react'
import type { FormEvent } from 'react'
import type { RegisterFormData } from '../../types/auth'
import { Button } from '../atoms/Button'
import { TextLink } from '../atoms/TextLink'
import { ArrowRightIcon, LoginIcon } from '../atoms/icons'
import { FormField } from '../molecules/FormField'
import { Divider } from '../molecules/Divider'
import { RememberRow } from '../molecules/RememberRow'
import { SocialLoginGroup } from '../molecules/SocialLoginGroup'

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit?.({ name, email, password, remember })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-5 px-10 py-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-1">Cadastro</h1>
        <p className="text-text-muted">Olá! Preencha seus dados.</p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          id="register-name"
          label="Nome"
          type="text"
          placeholder="Nome completo"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormField
          id="register-email"
          label="Email"
          type="email"
          placeholder="Digite seu email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="register-password"
          label="Senha"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <RememberRow checked={remember} onCheckedChange={setRemember} />

      <Button variant="primary" type="submit" icon={<ArrowRightIcon />}>
        Cadastrar
      </Button>

      <Divider>ou entre com outras contas</Divider>

      <SocialLoginGroup />

      <div className="flex flex-col items-center gap-1 mt-auto">
        <p className="text-sm text-text-muted">Já tem conta?</p>
        <TextLink to="/login" icon={<LoginIcon />} className="font-semibold">
          Faça seu login!
        </TextLink>
      </div>
    </form>
  )
}
