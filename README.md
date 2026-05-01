# Hotel API

API de hotelaria em Node.js com TypeScript. O projeto gerencia hospedes, quartos e reservas usando uma arquitetura em camadas com dominio, casos de uso e infraestrutura separados.

## Stack

- Node.js + TypeScript
- Fastify
- PostgreSQL
- pg-promise
- Jest + ts-jest
- Docker Compose

## Requisitos

- Docker
- Docker Compose
- Node.js/npm no host apenas para executar os scripts de orquestracao

Este projeto deve ser executado dentro do Docker. A API, banco e dependencias esperadas rodam nos containers.

## Configuracao inicial

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Use estes valores para o ambiente Docker:

```env
SERVER_PORT=3000
AUTH_SECRET=change-me

DATABASE_HOST=database
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=hotel
DATABASE_PORT=5432
DATABASE_URL=postgres://user:password@database:5432/hotel
```

Suba os containers:

```bash
npm run docker:compose:up:build
```

Inicie a API dentro do container backend:

```bash
npm run docker:dev
```

A API ficara disponivel em:

```txt
http://localhost:3000
```

Teste o health check:

```bash
curl http://localhost:3000/health
```

## Comandos principais

Subir containers:

```bash
npm run docker:compose:up
```

Subir containers reconstruindo a imagem:

```bash
npm run docker:compose:up:build
```

Entrar no container backend:

```bash
npm run docker:compose:exec:backend
```

Rodar a API em desenvolvimento:

```bash
npm run docker:dev
```

Rodar testes dentro do container:

```bash
npm run docker:test
```

Checar TypeScript:

```bash
npm run docker:typecheck
```

Compilar o projeto:

```bash
npm run docker:build
```

Derrubar containers e remover o volume do banco:

```bash
npm run docker:compose:down
```

Resetar o banco, recriando o volume PostgreSQL e subindo os containers novamente:

```bash
npm run docker:db:reset
```

Esse comando apaga todos os dados locais do banco.

## Fluxo recomendado de desenvolvimento

1. Configure o `.env`.
2. Suba os containers com `npm run docker:compose:up:build`.
3. Rode a API com `npm run docker:dev`.
4. Use `api.rest` ou um cliente HTTP para testar endpoints.
5. Antes de finalizar uma mudanca, rode:

```bash
npm run docker:test
npm run docker:typecheck
npm run docker:build
```

## Endpoints

Health:

```http
GET /health
```

Hospedes:

```http
GET /guests/:id
```

Autenticacao:

```http
POST /auth/signup
POST /auth/signin
POST /auth/logout
```

Quartos:

```http
POST /rooms
GET /rooms
GET /rooms?status=available
GET /rooms/:id
```

Reservas:

```http
POST /reservations
PUT /reservations/:id/cancel
GET /reservations/:id
```

Exemplos completos de chamadas estao em `api.rest`.

## Autenticacao

Use `POST /auth/signup` para cadastrar um hospede e receber um token. Use `POST /auth/signin` para entrar novamente.

Rotas de hospede e reserva exigem header Bearer:

```http
Authorization: Bearer <token>
```

Ao criar uma reserva, o `guestId` vem do token autenticado. A API nao permite criar ou cancelar reservas em nome de outro hospede.

## Estrutura do projeto

```txt
src/
  domain/        Entidades, value objects, eventos e contratos
  application/   Casos de uso, queries e handlers
  infra/         HTTP, banco, repositorios, DI, eventos e logging
test/
  unit/          Testes de dominio e value objects
  feature/       Testes de use cases, controllers e queries
docker/
  database/      SQL inicial do PostgreSQL
  server/        Dockerfile do backend
```

## Observacoes importantes

- O backend no `docker-compose.yml` inicia com `sleep infinity`; isso e intencional para manter o container vivo. Rode `npm run docker:dev` para iniciar a API.
- Os testes devem ser executados dentro do Docker.
- `npm test`, quando executado dentro do container, sobe a API temporariamente, espera `/health` responder e roda a suite Jest.
- `npm run docker:db:reset` remove o volume local do PostgreSQL e recria o banco a partir de `docker/database/init.sql`.
- O schema inicial do banco fica em `docker/database/init.sql`.
- Instrucoes para agentes de IA ficam em `AGENTS.md`.
