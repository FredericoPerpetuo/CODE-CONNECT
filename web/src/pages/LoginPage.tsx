import { AuthLayout } from '../templates/AuthLayout'
import { LoginForm } from '../components/organisms/LoginForm'

export function LoginPage() {
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
