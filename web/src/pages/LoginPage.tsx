import { useEffect } from 'react'
import { AuthLayout } from '../templates/AuthLayout'
import { LoginForm } from '../components/organisms/LoginForm'

export function LoginPage() {
  useEffect(() => {
    document.title = 'Login — Code Connect'
  }, [])

  return (
    <AuthLayout
      banner={{
        src: '/banner-login.png',
        alt: 'Mulher sorrindo em frente a uma tela com arte digital verde',
      }}
    >
      <LoginForm />
    </AuthLayout>
  )
}
