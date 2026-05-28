# Plano: Backend inicial — Auth + Users (in-memory)

## Context

O backend em [api/](api/) é um boilerplate NestJS 11 vazio (apenas `app.controller`/`app.service` com "Hello World"). Precisamos implementar a primeira camada funcional para sustentar as telas de Login e Cadastro já criadas no frontend:

- `POST /auth/register` — cadastro de usuário (nome, email, senha).
- `POST /auth/login` — autenticação retornando JWT.
- `GET /auth/me` — retorna dados do usuário autenticado (protegido por guard JWT, padrão Passport da doc NestJS).

Restrições explícitas:
- Sem ORM e sem banco — armazenamento em **array em memória** (descartado a cada restart). Será trocado por persistência real em iteração futura.
- **Swagger** obrigatório, com inputs e outputs documentados.
- Conventional Commits + Atomic Design (frontend) já em vigor — manter padrões do [CLAUDE.md](CLAUDE.md).

Decisões alinhadas com o usuário:
- Módulos **`auth` + `users` separados** (users gerencia o store, auth orquestra login/register/me).
- Rota do usuário logado: **`GET /auth/me`**.
- Guard via **`@nestjs/passport` + `passport-jwt`** (`JwtStrategy` + `AuthGuard('jwt')`).
- Segredo/expiração em **`.env`** via `@nestjs/config`.

---

## Dependências a instalar

Em [api/](api/) (via `pnpm --filter api add ...`):

**Runtime:**
- `@nestjs/swagger` `@nestjs/config`
- `@nestjs/jwt` `@nestjs/passport` `passport` `passport-jwt`
- `class-validator` `class-transformer`
- `bcrypt` `uuid`

**Dev:**
- `@types/passport-jwt` `@types/bcrypt` `@types/uuid`

---

## Estrutura de arquivos

```
api/
  .env                              # JWT_SECRET, JWT_EXPIRES_IN, PORT
  .env.example                      # template versionado
  src/
    main.ts                         # + ValidationPipe global + SwaggerModule.setup
    app.module.ts                   # + ConfigModule.forRoot + UsersModule + AuthModule
    users/
      users.module.ts
      users.service.ts              # InMemory store (Map<string, User>)
      user.entity.ts                # interface { id, name, email, passwordHash }
      dto/
        create-user.dto.ts          # name, email, password (class-validator)
        user-response.dto.ts        # id, name, email (sem hash)
      users.service.spec.ts
    auth/
      auth.module.ts                # PassportModule + JwtModule.registerAsync(ConfigService)
      auth.controller.ts            # POST /register, POST /login, GET /me
      auth.service.ts               # validateUser, register, login (emite JWT)
      dto/
        register.dto.ts             # extends/reusa CreateUserDto
        login.dto.ts                # email, password
        auth-response.dto.ts        # access_token + user
      strategies/
        jwt.strategy.ts             # PassportStrategy(Strategy) — extrai Bearer, valida sub
      guards/
        jwt-auth.guard.ts           # AuthGuard('jwt')
      decorators/
        current-user.decorator.ts   # @CurrentUser() — extrai req.user
      auth.service.spec.ts
      auth.controller.spec.ts
  test/
    auth.e2e-spec.ts                # register → login → /me (happy path + erros)
```

---

## Contratos dos endpoints (Swagger)

### POST `/auth/register` → `201`
- **Body** `RegisterDto`: `name: string (min 2)`, `email: string (IsEmail)`, `password: string (min 8)`.
- **Response** `UserResponseDto`: `{ id, name, email }`.
- **Erros**: `400` validação; `409` email já cadastrado.

### POST `/auth/login` → `200`
- **Body** `LoginDto`: `email`, `password`.
- **Response** `AuthResponseDto`: `{ access_token: string, user: UserResponseDto }`.
- **Erros**: `400` validação; `401` credenciais inválidas.

### GET `/auth/me` → `200` (protegido)
- **Header**: `Authorization: Bearer <jwt>`.
- **Response**: `UserResponseDto`.
- **Erros**: `401` token ausente/inválido/expirado.

Todos os DTOs decorados com `@ApiProperty` para o Swagger renderizar exemplos e tipos.

---

## Pontos-chave de implementação

- **`UsersService`**: store interno `private readonly users = new Map<string, User>()`. Métodos: `create(dto)` (gera `uuid`, hash com `bcrypt` rounds=10, lança `ConflictException` se email duplicado), `findByEmail(email)`, `findById(id)`. Nunca retornar `passwordHash` — usar `toResponse(user)` interno.
- **`AuthService.validateUser(email, password)`**: busca por email, compara com `bcrypt.compare`. Retorna user ou `null`.
- **`AuthService.login(user)`**: payload `{ sub: user.id, email: user.email }`, assina com `JwtService.signAsync`. Devolve `{ access_token, user: toResponse }`.
- **`JwtStrategy`** (padrão da [doc NestJS](https://docs.nestjs.com/security/authentication#implementing-passport-jwt)): `jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()`, `secretOrKey: ConfigService.get('JWT_SECRET')`. `validate(payload)` busca usuário por `payload.sub` no `UsersService`; se não existe, `UnauthorizedException`. Retorna `UserResponseDto` (vira `req.user`).
- **`JwtAuthGuard`**: `export class JwtAuthGuard extends AuthGuard('jwt') {}` — usado como `@UseGuards(JwtAuthGuard)` em `/auth/me`.
- **`@CurrentUser()`**: `createParamDecorator((_, ctx) => ctx.switchToHttp().getRequest().user)` — açúcar para o controller.
- **`main.ts`**: adicionar `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` + bootstrap do Swagger em `/api/docs` (`DocumentBuilder().setTitle('Code Connect API').addBearerAuth().build()`).
- **`AuthModule`**: `JwtModule.registerAsync({ imports:[ConfigModule], inject:[ConfigService], useFactory: cs => ({ secret: cs.get('JWT_SECRET'), signOptions:{ expiresIn: cs.get('JWT_EXPIRES_IN','1h') } }) })`. Exporta `AuthService` se outros módulos forem precisar.

---

## Arquivos críticos a modificar/criar

- [api/package.json](api/package.json) — novas deps.
- [api/src/main.ts](api/src/main.ts) — ValidationPipe + Swagger.
- [api/src/app.module.ts](api/src/app.module.ts) — ConfigModule + UsersModule + AuthModule.
- [api/.env](api/.env) (não versionar) + [api/.env.example](api/.env.example) (versionar).
- Toda a árvore `api/src/users/**` e `api/src/auth/**` (nova).
- [api/test/auth.e2e-spec.ts](api/test/auth.e2e-spec.ts) — fluxo end-to-end.
- [api/src/app.controller.spec.ts](api/src/app.controller.spec.ts) e [api/test/app.e2e-spec.ts](api/test/app.e2e-spec.ts) — manter ou remover junto com `AppController` (decidir na execução; mais seguro manter como health-check `GET /`).

---

## Verificação (end-to-end)

1. `pnpm api:dev` — sobe na porta 3000 sem erros.
2. Abrir `http://localhost:3000/api/docs` — Swagger lista os 3 endpoints com botão **Authorize** (Bearer).
3. **Fluxo manual no Swagger UI:**
   - `POST /auth/register` com `{ name, email, password }` → `201` + user (sem hash).
   - Repetir mesmo email → `409`.
   - `POST /auth/register` com email inválido / senha curta → `400` com mensagens do `class-validator`.
   - `POST /auth/login` com credenciais válidas → `200` + `access_token`.
   - `POST /auth/login` com senha errada → `401`.
   - Clicar **Authorize**, colar token, chamar `GET /auth/me` → `200` + user.
   - `GET /auth/me` sem token → `401`.
4. **Testes automatizados:**
   - `pnpm api:test` — unit tests de `UsersService` (hash, conflito, find) e `AuthService` (validateUser, login).
   - `pnpm --filter api test:e2e` — `auth.e2e-spec.ts` cobre register→login→/me + erros 400/401/409.
5. **Commits** seguindo Conventional Commits, escopo `api`/`auth`/`users`. Sugestão de granularidade:
   - `chore(api): add auth/swagger dependencies`
   - `feat(api): bootstrap swagger and global validation pipe`
   - `feat(users): add in-memory users module`
   - `feat(auth): add register, login and jwt guard with passport`
   - `test(auth): add e2e tests for register/login/me`
