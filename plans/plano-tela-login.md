# Plano — Página de Login (CODE-CONNECT / `web`)

## Contexto

O frontend `web` é hoje o template inicial do Vite (React 19 + TypeScript + CSS puro) — `App.tsx`/`App.css` e `assets/` são descartáveis. A tarefa é construir a **tela de Login** fiel ao mockup fornecido: uma página escura com um card central de duas colunas (banner à esquerda, formulário à direita).

Decisões já confirmadas com o usuário:
1. **React Router** — rotas `/login` e `/cadastro` (cadastro como placeholder por enquanto).
2. **Tailwind CSS** (v4, plugin `@tailwindcss/vite`) — sem arquivos CSS por componente.
3. **Auth sempre escura** — login/cadastro forçam tema escuro; o accent global passa de roxo para o **verde da marca code connect**.

A página de **Cadastro** virá depois com o **mesmo layout de card**, mudando apenas o banner e os campos do formulário. Por isso a arquitetura usa Atomic Design com um *template* `AuthLayout` como ponto de reuso.

## Resultado esperado

`/login` renderiza a tela do mockup; `/` redireciona para `/login`; `/cadastro` resolve para um placeholder. Cadastro futuro = novo banner + novo organism de formulário dentro do mesmo `AuthLayout`.

---

## 1. Setup de dependências e build

**Instalar:** `npm install react-router-dom tailwindcss @tailwindcss/vite` (dentro de `web/`).

**`web/vite.config.ts`** — adicionar o plugin:
```ts
import tailwindcss from '@tailwindcss/vite'
// ...
plugins: [react(), tailwindcss()]
```

**`web/src/index.css`** — substituir TODO o conteúdo (tokens roxos + estilos do starter saem):
```css
@import "tailwindcss";

@theme {
  --color-brand: #8df59a;          /* ajustar ao verde exato do mockup */
  --color-brand-strong: #6fe084;   /* hover */
  --color-brand-ink: #0d1117;      /* texto escuro sobre o botão verde */
  --color-surface-base: #0d0d0f;   /* fundo da página */
  --color-surface-card: #1c1d22;   /* card */
  --color-surface-input: #2a2b30;  /* inputs */
  --color-border-subtle: #2e303a;
  --color-text-primary: #f3f4f6;
  --color-text-muted: #9ca3af;
  --font-sans: system-ui, "Segoe UI", Roboto, sans-serif;
}

html, body, #root {
  margin: 0;
  min-height: 100svh;
  background-color: var(--color-surface-base);
  color: var(--color-text-primary);
  color-scheme: dark;
}
```
Tailwind v4 não usa `tailwind.config.js`. O `@theme` gera utilitários (`bg-surface-card`, `text-brand`, `border-border-subtle`...). "Sempre escuro" = nunca usar a variante `dark:` nem `prefers-color-scheme`.

**`web/index.html`** — `<title>` para `Code Connect — Login`.

---

## 2. Estrutura de pastas (`web/src/`)

```
main.tsx                  # MODIFICADO — monta <RouterProvider/>
router.tsx                # NOVO — tabela de rotas
index.css                 # SUBSTITUÍDO — entrada Tailwind + @theme
types/auth.ts             # NOVO — LoginFormData
components/
  atoms/
    icons.tsx             # ArrowRightIcon, ClipboardIcon, LogoMark (SVG inline)
    Button.tsx
    TextInput.tsx
    Label.tsx
    Checkbox.tsx
    TextLink.tsx
  molecules/
    FormField.tsx
    Divider.tsx
    SocialButton.tsx
    SocialLoginGroup.tsx
    RememberRow.tsx
  organisms/
    LoginForm.tsx
    BackgroundWatermark.tsx
templates/
  AuthLayout.tsx          # ponto de reuso (banner + children)
pages/
  LoginPage.tsx
  CadastroPage.tsx        # placeholder
```

**Excluir:** `src/App.tsx`, `src/App.css`, `src/assets/` (react.svg, vite.svg, hero.png). **Manter** em `web/public/`: `banner-login.png`, `github.png`, `gmail.png`, `favicon.svg`.

---

## 3. Componentes (Atomic Design)

Imports de tipo usam `import type` (`verbatimModuleSyntax` ligado). `noUnusedLocals/Parameters` ligados — sem props/imports não usados.

**Atoms**
- `icons.tsx` — três componentes SVG inline: seta (botão), prancheta (link cadastro), logo corrente (watermark).
- `Button` — `extends ButtonHTMLAttributes`, props extras `variant?: 'primary'`, `icon?: ReactNode`. `type` default `"button"`. Variante primary = verde, largura total, texto escuro.
- `TextInput` — `extends InputHTMLAttributes`, `id` obrigatório. Fundo `surface-input`.
- `Label` — `extends LabelHTMLAttributes`, `htmlFor` obrigatório.
- `Checkbox` — `id` + `label` obrigatórios; check verde.
- `TextLink` — envolve o `Link` do react-router; props `to`, `underline?`, `icon?`.

**Molecules**
- `FormField` — `Label` + `TextInput` empilhados, mesmo `id`. Props `id`, `label` + atributos nativos de input.
- `Divider` — linha · texto · linha (para "ou entre com outras contas").
- `SocialButton` — `iconSrc` + `label`, ícone acima do texto. `type="button"`.
- `SocialLoginGroup` — dois `SocialButton` lado a lado (Github via `/github.png`, Gmail via `/gmail.png`).
- `RememberRow` — `Checkbox` "Lembrar-me" à esquerda + link "Esqueci a senha" à direita. Props `checked`, `onCheckedChange`.

**Organisms**
- `LoginForm` — coluna direita completa: `<h1>Login</h1>`, subtítulo, dois `FormField` (Email/usuário e Senha), `RememberRow`, `Button` primary "Login →", `Divider`, `SocialLoginGroup`, "Ainda não tem conta?" + `TextLink to="/cadastro"` "Crie seu cadastro!". Estado controlado próprio. Prop `onSubmit?: (data: LoginFormData) => void`.
- `BackgroundWatermark` — `LogoMark` repetidos em posição absoluta atrás do card; `aria-hidden`.

**Template (reuso)**
- `AuthLayout` — `interface AuthLayoutProps { banner: { src: string; alt: string }; children: ReactNode }`. Renderiza `<main>` escuro de viewport cheia → `BackgroundWatermark` → card arredondado centrado (flex row) → coluna esquerda `<img>` do banner + coluna direita `{children}`. **Cadastro reusa este template inteiro.**

**Pages**
- `LoginPage` — `<AuthLayout banner={{ src: '/banner-login.png', alt: '...' }}><LoginForm /></AuthLayout>`.
- `CadastroPage` — placeholder: `<AuthLayout banner={{ src: '/banner-login.png', alt: '' }}><p>Em breve</p></AuthLayout>` (só para a rota resolver).

`types/auth.ts`: `export interface LoginFormData { identifier: string; password: string; remember: boolean }`.

---

## 4. Roteamento

**`web/src/router.tsx`** (novo):
```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import CadastroPage from './pages/CadastroPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/cadastro', element: <CadastroPage /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
```

**`web/src/main.tsx`** — montar `<RouterProvider router={router} />` dentro de `<StrictMode>`, importando `./index.css`. `App.tsx` deixa de ser usado e é excluído.

---

## 5. Comportamento do formulário (apenas UI)

`LoginForm` usa `useState` para `identifier`, `password`, `remember` — inputs controlados. `<form onSubmit>` chama `e.preventDefault()` e, se existir, `props.onSubmit(data)`. Sem chamada à API. Botões sociais e "Esqueci a senha" são `type="button"` inertes (sem destino — evitar `href="#"`). "Crie seu cadastro!" navega de verdade para `/cadastro`. A prop `onSubmit` é o ponto de encaixe para integração futura com a API.

## 6. Acessibilidade

- `FormField` força associação `Label htmlFor` ↔ `TextInput id` via interface obrigatória (`login-identifier`, `login-password`).
- Botão de login = `type="submit"`; demais botões = `type="button"` (default do atom `Button`).
- Senha: `type="password"`, `autoComplete="current-password"`; identificador: `autoComplete="username"`.
- Banner com `alt` descritivo curto; ícones Github/Gmail com `alt=""` (o texto visível é o nome acessível); `BackgroundWatermark` com `aria-hidden`.
- `<h1>` = "Login"; `<main>` envolve a página; `<form>` envolve os campos. Focus ring visível com `focus-visible:` na cor `brand`.

---

## 7. Ordem de execução

1. `npm install` das três dependências.
2. Ajustar `vite.config.ts` e substituir `index.css` (antes dos componentes, para os utilitários resolverem).
3. Criar componentes de baixo para cima: atoms → molecules → organisms → `AuthLayout` → pages.
4. Criar `router.tsx`, ajustar `main.tsx` e `index.html`.
5. Excluir `App.tsx`, `App.css`, `assets/` por último (depois que `main.tsx` parar de importar `App`).

## 8. Verificação

- `npm run dev` em `web/` → abrir `http://localhost:5173`: `/` redireciona para `/login`; a tela bate com o mockup (card escuro, banner à esquerda, formulário verde à direita, botões sociais, watermark de fundo).
- Digitar nos campos (inputs controlados respondem); marcar/desmarcar "Lembrar-me"; clicar "Login" não recarrega a página.
- Clicar "Crie seu cadastro!" navega para `/cadastro` (placeholder "Em breve").
- `npm run build` → `tsc -b` passa sem erros (atenção a `noUnusedLocals` e `import type`).
- `npm run lint` sem erros.

## Observações abertas

- O verde exato (`--color-brand`) deve ser calibrado pelo mockup na implementação.
- Watermark: `LogoMark` posicionados (assumido) ou um único background tileado — decidir na implementação se ficar mais simples.
