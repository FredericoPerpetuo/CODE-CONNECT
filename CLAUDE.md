# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**Code Connect** is a pnpm monorepo with two packages managed via `pnpm-workspace.yaml`:

- `api/` — NestJS 11 backend (TypeScript, Express adapter), runs on port 3000
- `web/` — React 19 + Vite frontend (TypeScript)

## Commands

All commands run from the monorepo root unless otherwise noted.

### Development

```bash
pnpm dev              # Start both api and web in parallel (watch mode)
pnpm api:dev          # API only (nest start --watch)
pnpm web:dev          # Web only (vite)
```

### Build

```bash
pnpm api:build        # nest build → dist/
pnpm web:build        # tsc + vite build
```

### Test

```bash
pnpm api:test                                        # Run all API unit tests
pnpm --filter api test:watch                         # Watch mode
pnpm --filter api test:cov                           # Coverage
pnpm --filter api test:e2e                           # E2E tests (test/jest-e2e.json)
# Run a single API spec file:
pnpm --filter api test -- --testPathPattern=app.controller
pnpm --filter web test                               # Run all web component tests
```

### Lint & Format

```bash
pnpm api:lint         # ESLint with auto-fix on api/src and api/test
pnpm web:lint         # ESLint on web/
pnpm --filter api format  # Prettier on api/src and api/test
```

## Architecture

### API (NestJS)

Standard NestJS module layout in `api/src/`:

- `main.ts` — bootstrap; listens on `process.env.PORT ?? 3000`
- `app.module.ts` — root module, imports controllers and providers
- `app.controller.ts` — HTTP layer; add route handlers here
- `app.service.ts` — business logic injected into the controller
- `app.controller.spec.ts` — unit test collocated next to the controller

E2E tests live in `api/test/` and match `*.e2e-spec.ts`.

When adding a new feature, follow NestJS convention: create a feature module (module + controller + service), then import it into `AppModule`.

#### REST conventions

- Use resource-named, plural, lowercase URL segments: `GET /posts`, `GET /posts/:id`, `POST /posts`, `PATCH /posts/:id`, `DELETE /posts/:id`.
- Never encode actions in the URL (no `/getPosts`, `/createPost`).
- Return appropriate HTTP status codes: `200` for successful reads, `201` for resource creation, `204` for deletion, `400` for validation errors, `404` when a resource is not found.
- Response bodies must be JSON. Collections are returned as arrays at the top level or under a descriptive key (e.g., `{ "data": [] }`), never as plain objects wrapping a single item.
- Controllers handle HTTP concerns only (status codes, headers, request/response mapping). Business logic lives in services.

### Web (React + Vite)

The web package uses **Atomic Design** as its component organization model and **Tailwind CSS** for styling.

#### Directory structure

```
web/src/
  components/
    atoms/        # Smallest primitives: Button, Input, Badge, Avatar…
    molecules/    # Combinations of atoms: SearchBar, CardHeader…
    organisms/    # Feature-level sections: PostCard, Navbar, Sidebar…
    templates/    # Page layouts without real data
  pages/          # Route-level components that compose templates + organisms
```

#### Rules

- Every component must have a collocated test file (`ComponentName.test.tsx`) covering its essential usage (render, key interactions, and prop variants that change visible output).
- Use Tailwind utility classes directly in JSX. Avoid writing custom CSS unless Tailwind cannot express the style.
- Never use inline `style` attributes for layout or theming — use Tailwind classes.
- Atoms must be generic and reusable with no business logic. Business logic belongs in organisms or pages.

## Tooling Notes

- Package manager: **pnpm** (workspaces). Do not use npm or yarn.
- API formatter: **Prettier** (config in `api/.prettierrc`), enforced via ESLint plugin.
- API test runner: **Jest** with `ts-jest`; unit test regex `*.spec.ts`, rootDir `api/src`.
- Web bundler: **Vite**; TypeScript strict mode via `tsc -b` before build.

## Git — Conventional Commits

All commits in this repository must follow the [Conventional Commits](https://www.conventionalcommits.org/) spec.

Format: `<type>(<scope>): <description>`

Common types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `style`, `perf`.

Scope should identify the package or feature area: `api`, `web`, `auth`, `posts`, etc.

```
feat(api): add pagination to GET /posts
fix(web): correct button disabled state in PostForm
test(web): add unit test for Avatar atom
chore(api): update NestJS to 11.1
```

- Use the imperative mood in the description ("add", not "added" or "adds").
- Breaking changes must include `BREAKING CHANGE:` in the commit footer.
