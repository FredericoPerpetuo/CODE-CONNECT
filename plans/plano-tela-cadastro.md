# Plano: Implementação da Tela de Cadastro

## Contexto

O projeto já tem a tela de Login implementada com Atomic Design (atoms → molecules → organisms → templates → pages) e a rota `/cadastro` já existe, mas hoje `CadastroPage.tsx` é apenas um stub ("Em breve").

O design da tela de cadastro no Figma ([node 155-3469](https://www.figma.com/design/GpEwdCoYby1W0PdPBljUVh/CodeConnectAlura?node-id=155-3469)) tem o mesmo esqueleto da tela de Login (banner à esquerda + formulário à direita, dentro de um card escuro), o que abre uma oportunidade clara de reuso: **template, layout, todos os atoms/molecules e a maioria dos organisms já existem**.

A meta é implementar o `RegisterForm` reaproveitando o máximo possível, adicionar somente o que é estritamente novo (1 ícone, 1 tipo, 1 organism), e fazer ajustes finos para bater com o Figma.

## Diferenças entre Login e Cadastro (validadas via Figma MCP)

| Item              | Login                            | Cadastro                          |
|-------------------|----------------------------------|-----------------------------------|
| Título            | `Login`                          | `Cadastro`                        |
| Subtítulo         | `Boas-vindas! Faça seu login.`   | `Olá! Preencha seus dados.`       |
| Campos            | Email/usuário, Senha             | Nome, Email, Senha                |
| Botão             | `Login` + ArrowRightIcon         | `Cadastrar` + ArrowRightIcon      |
| Rodapé texto      | `Ainda não tem conta?`           | `Já tem conta?`                   |
| Rodapé link       | `Crie seu cadastro!` + Clipboard | `Faça seu login!` + LoginIcon     |
| Link destino      | `/cadastro`                      | `/login`                          |
| Checkbox          | "Lembrar-me" + "Esqueci senha"   | "Lembrar-me" + "Esqueci senha" (mantido conforme Figma) |
| Banner            | `/banner-login.png`              | `/banner-login.png` (mesmo asset) |

## Componentes a reaproveitar (sem mudança)

- [AuthLayout](web/src/templates/AuthLayout.tsx) — template do card 2 colunas
- [FormField](web/src/components/molecules/FormField.tsx) — Label + TextInput
- [RememberRow](web/src/components/molecules/RememberRow.tsx) — checkbox + "esqueci senha"
- [Divider](web/src/components/molecules/Divider.tsx) — linha com texto central
- [SocialLoginGroup](web/src/components/molecules/SocialLoginGroup.tsx) — Github + Gmail
- [Button](web/src/components/atoms/Button.tsx) — variant primary com icon
- [TextLink](web/src/components/atoms/TextLink.tsx) — link react-router com icon
- [ArrowRightIcon](web/src/components/atoms/icons.tsx) — já existe
- [BackgroundWatermark](web/src/components/organisms/BackgroundWatermark.tsx) — usado dentro do AuthLayout
- [router.tsx](web/src/router.tsx) — rota `/cadastro` já configurada

## Mudanças

### 1. Adicionar tipo `RegisterFormData`
Arquivo: [web/src/types/auth.ts](web/src/types/auth.ts) — adicionar ao final, sem mexer no `LoginFormData` existente:
```ts
export interface RegisterFormData {
  name: string
  email: string
  password: string
  remember: boolean
}
```

### 2. Adicionar `LoginIcon` em `icons.tsx`
Arquivo: [web/src/components/atoms/icons.tsx](web/src/components/atoms/icons.tsx) — adicionar SVG inline no mesmo padrão dos demais (viewBox 24x24, stroke currentColor). Ícone "seta entrando em porta" (Material Icons `login`).

### 3. Criar `RegisterForm.tsx`
Arquivo novo: `web/src/components/organisms/RegisterForm.tsx` — espelho estrutural do [LoginForm](web/src/components/organisms/LoginForm.tsx) com:
- `useState` para `name`, `email`, `password`, `remember`
- Cabeçalho: `Cadastro` / `Olá! Preencha seus dados.`
- 3× `<FormField>`:
  - `id="register-name"` label `Nome` type `text` placeholder `Nome completo` autoComplete `name`
  - `id="register-email"` label `Email` type `email` placeholder `Digite seu email` autoComplete `email`
  - `id="register-password"` label `Senha` type `password` autoComplete `new-password`
- `<RememberRow checked={remember} onCheckedChange={setRemember} />`
- `<Button variant="primary" type="submit" icon={<ArrowRightIcon />}>Cadastrar</Button>`
- `<Divider>ou entre com outras contas</Divider>`
- `<SocialLoginGroup />`
- Rodapé: `Já tem conta?` + `<TextLink to="/login" icon={<LoginIcon />} className="font-semibold">Faça seu login!</TextLink>`
- Props: `onSubmit?: (data: RegisterFormData) => void`

### 4. Substituir stub em `CadastroPage.tsx`
Arquivo: [web/src/pages/CadastroPage.tsx](web/src/pages/CadastroPage.tsx) — trocar a `<div>"Em breve"</div>` por `<RegisterForm />` e atualizar o `alt` do banner para descrever a imagem (mesmo padrão do LoginPage).

## Verificação

1. `cd web && npm run dev` e abrir `http://localhost:5173/cadastro`.
2. Conferir contra o screenshot do Figma:
   - Card escuro centralizado com banner à esquerda e form à direita
   - Título "Cadastro" + subtítulo "Olá! Preencha seus dados."
   - 3 campos (Nome, Email, Senha) com labels acima
   - Checkbox "Lembrar-me" + "Esqueci a senha" na mesma linha
   - Botão verde "Cadastrar" com seta
   - Divider "ou entre com outras contas"
   - Botões Github + Gmail
   - Rodapé "Já tem conta?" + link verde "Faça seu login!" com ícone
3. Navegar via link de rodapé para `/login` e voltar para `/cadastro` clicando em "Crie seu cadastro!" no login — fluxo end-to-end.
4. `npm run build` em `web/` para garantir que TypeScript não acusa erros.

## Fora de escopo

- Validação de formulário (zod/react-hook-form) — projeto não usa libs de validação; manter padrão atual (HTML nativo + onChange).
- Integração com backend / API de cadastro.
- Code Connect mapping — `get_code_connect_map` retornou erro de plano no Figma, então a tela usa componentes locais diretamente.
