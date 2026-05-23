import { useEffect } from 'react'
import { AuthLayout } from '../templates/AuthLayout'
import { RegisterForm } from '../components/organisms/RegisterForm'

export function CadastroPage() {
  useEffect(() => {
    document.title = 'Cadastro — Code Connect'
  }, [])

  return (
    <AuthLayout
      banner={{
        src: '/banner-cadastro.png',
        alt: 'Mulher sorrindo em frente a uma tela com arte digital verde',
      }}
    >
      <RegisterForm />
    </AuthLayout>
  )
}
