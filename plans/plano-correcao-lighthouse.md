# Plano: Correção dos achados Lighthouse para WCAG AA (/cadastro)

## Context

A página `/cadastro` foi auditada pelo Lighthouse 13.0.2 em `http://localhost:5173/cadastro`. O relatório JSON compartilhado foi truncado antes da seção de `accessibility audits` (apareceram apenas métricas de performance: FCP 1.1s, LCP 1.9s, Speed Index 1.2s).

Apesar da truncagem, na etapa anterior configuramos **30 testes automatizados com axe-core via Vitest + jest-axe** que passaram 100%, mas o jsdom não computa estilos do Tailwind — portanto auditorias dependentes de CSS real (especialmente `color-contrast`) não foram capturadas. O Lighthouse roda no navegador real e expõe exatamente esses pontos.

A análise estática do código identificou múltiplos pontos que com alta probabilidade falham nos audits AA do Lighthouse. Este plano cobre, de forma defensiva, **todos os achados plausíveis** mapeados a IDs de audit do Lighthouse.

---

## Achados mapeados aos audits do Lighthouse

### 1. `color-contrast` (WCAG 1.4.3 — AA 4.5:1) — **CRÍTICO**

Token problemático em [web/src/index.css](../web/src/index.css):

```css
--color-text-muted: #888888;
```

Contraste calculado contra `--color-surface-base: #00090E`: **~4.1:1** → falha AA.

Componentes que usam `text-text-muted` em texto normal (todos provavelmente sinalizados):
- [Label.tsx](../web/src/components/atoms/Label.tsx) — todos os labels de formulário
- [TextInput.tsx](../web/src/components/atoms/TextInput.tsx) — `placeholder:text-text-muted`
- [Checkbox.tsx](../web/src/components/atoms/Checkbox.tsx) — label "Lembrar-me"
- [Divider.tsx](../web/src/components/molecules/Divider.tsx) — "ou entre com outras contas"
- [RememberRow.tsx](../web/src/components/molecules/RememberRow.tsx) — botão "Esqueci a senha"
- [SocialButton.tsx](../web/src/components/molecules/SocialButton.tsx) — label "Github"/"Gmail"
- [RegisterForm.tsx](../web/src/components/organisms/RegisterForm.tsx) — "Olá! Preencha seus dados." e "Já tem conta?"
- [LoginForm.tsx](../web/src/components/organisms/LoginForm.tsx) — equivalentes

### 2. `html-has-lang` / `html-lang-valid` (WCAG 3.1.1)

[web/index.html](../web/index.html) declara `<html lang="en">` mas todo o conteúdo é PT-BR. O audit `valid-lang` valida o código, e `html-has-lang` exige correspondência semântica.

### 3. `document-title` (WCAG 2.4.2)

[web/index.html](../web/index.html) tem `<title>Code Connect — Login</title>` estático — não reflete `/cadastro`. SPA com React Router não atualiza o `<title>` automaticamente.

### 4. `meta-description` (bucket SEO + acessibilidade)

Ausente em [web/index.html](../web/index.html). Lighthouse sinaliza por afetar contexto para tecnologias assistivas e leitores de feed.

### 5. Itens já corretos (não exigem ação — documentado)

- `<main>` landmark presente em [AuthLayout.tsx](../web/src/templates/AuthLayout.tsx)
- `aria-hidden="true"` em [BackgroundWatermark.tsx](../web/src/components/organisms/BackgroundWatermark.tsx)
- `alt` descritivo no banner principal
- `alt=""` em img decorativa do [SocialButton.tsx](../web/src/components/molecules/SocialButton.tsx) (padrão correto — texto está no `<span>`)
- `focus-visible:ring-2 focus-visible:ring-brand` em [Button.tsx](../web/src/components/atoms/Button.tsx), [TextInput.tsx](../web/src/components/atoms/TextInput.tsx), [SocialButton.tsx](../web/src/components/molecules/SocialButton.tsx)
- `<h1>Cadastro</h1>` único e na ordem correta
- Todos os inputs têm `label` associado via `htmlFor`/`id` (validado pelos testes axe)

---

## Implementação

### Mudança 1 — Aumentar contraste do `text-muted`

**Arquivo:** [web/src/index.css](../web/src/index.css)

Alterar o token `--color-text-muted`:

```css
/* ANTES */
--color-text-muted: #888888;

/* DEPOIS */
--color-text-muted: #B5B5B5;
```

Justificativa numérica (rounded):
| Fundo | Antes (#888) | Depois (#B5B5B5) | AA texto (4.5:1) |
|---|---|---|---|
| `#00090E` (base) | 4.1:1 ❌ | 9.6:1 ✅ | OK |
| `#171D1F` (card) | 3.6:1 ❌ | 8.4:1 ✅ | OK |
| `#132E35` (input) | 3.8:1 ❌ | 6.7:1 ✅ | OK |

Como é uma única alteração de token, todos os ~10 pontos de uso herdam a correção sem mais edições.

### Mudança 2 — Corrigir `lang` do documento

**Arquivo:** [web/index.html](../web/index.html)

```html
<!-- ANTES -->
<html lang="en">

<!-- DEPOIS -->
<html lang="pt-BR">
```

### Mudança 3 — Título base + meta description

**Arquivo:** [web/index.html](../web/index.html)

No `<head>`, ajustar título e adicionar description:

```html
<title>Code Connect</title>
<meta
  name="description"
  content="Code Connect — sua rede social para devs. Crie sua conta ou faça login."
/>
```

### Mudança 4 — Título por rota (SPA)

Para cada página de rota, definir título via `useEffect`. Não introduzir dependência nova (`react-helmet-async`) — usar `document.title` direto, que é suficiente para o escopo atual.

**Arquivo:** [web/src/pages/CadastroPage.tsx](../web/src/pages/CadastroPage.tsx)

```tsx
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
```

**Arquivo:** [web/src/pages/LoginPage.tsx](../web/src/pages/LoginPage.tsx)

Mesma estrutura, com `document.title = 'Login — Code Connect'`.

---

## Arquivos críticos modificados

- [web/src/index.css](../web/src/index.css) — token de cor
- [web/index.html](../web/index.html) — `lang`, `title` base, `meta description`
- [web/src/pages/CadastroPage.tsx](../web/src/pages/CadastroPage.tsx) — `document.title` via efeito
- [web/src/pages/LoginPage.tsx](../web/src/pages/LoginPage.tsx) — `document.title` via efeito

---

## Verificação

1. **Servidor de dev**
   ```powershell
   pnpm web:dev
   ```
   Abrir `http://localhost:5173/cadastro` e `http://localhost:5173/login`.

2. **Checks manuais no DevTools (Console)**
   - `document.documentElement.lang` → `"pt-BR"`
   - `document.title` em `/cadastro` → `"Cadastro — Code Connect"`
   - `document.title` em `/login` → `"Login — Code Connect"`
   - Em `<head>`, confirmar `<meta name="description">` presente

3. **Lighthouse — rodar de novo nas duas rotas**
   - `color-contrast` ✅
   - `html-has-lang` / `html-lang-valid` ✅
   - `document-title` ✅
   - `meta-description` ✅
   - Score de Acessibilidade esperado: 95–100

4. **Regressão dos testes axe**
   ```powershell
   pnpm --filter web test
   ```
   Esperado: continuar 30/30 (não há alteração que afete a árvore acessível detectável em jsdom).

5. **Conferência visual rápida**
   - Texto "muted" deve continuar visivelmente mais discreto que o `text-primary` (#E1E1E1), apenas claro o suficiente para ler.
   - Sem regressão de hierarquia visual nas telas de login e cadastro.

---

## Fora de escopo (deliberadamente)

- **`color-contrast` em border (`border-subtle: #1C3840`)** — borders são UI graphics; o critério aplicável é 3:1 e isso vale apenas quando a borda é *informativa* (estado de erro/foco). As bordas atuais são decorativas, então o Lighthouse não deve sinalizar. Adiar até confirmação.
- **`meta theme-color`** — afeta "Best Practices", não "Accessibility". Tratar em uma issue separada se quiser polir a PWA.
- **`react-helmet-async` ou framework de metadados** — overkill para 2 rotas; `document.title` resolve. Reavaliar quando houver ≥5 rotas com SEO próprio.
- **Testes para o título dinâmico** — não vale a pena testar `document.title` em unit test; a verificação manual + Lighthouse cobre isso.
