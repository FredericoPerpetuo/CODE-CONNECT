import { AuthLayout } from '../templates/AuthLayout'

export function CadastroPage() {
  return (
    <AuthLayout
      banner={{
        src: '/banner-login.png',
        alt: '',
      }}
    >
      <div className="flex flex-col items-center justify-center flex-1 p-10">
        <p className="text-text-muted">Em breve</p>
      </div>
    </AuthLayout>
  )
}
