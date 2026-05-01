# AGENTS.md

## Visao geral do projeto

Este repositorio contem uma API de hotelaria em Node.js com TypeScript. O dominio cobre hospedes, quartos e reservas, incluindo criacao, consulta, cancelamento, validacoes de valor de objeto e eventos de dominio.

A arquitetura segue uma separacao em camadas:

- `src/domain`: entidades, value objects, eventos, contratos de repositorio e contratos transversais.
- `src/application`: casos de uso, queries e handlers de eventos.
- `src/infra`: adaptadores concretos para HTTP, banco de dados, DI, logging, eventos e repositorios.
- `test/unit`: testes de unidade do dominio e value objects.
- `test/feature`: testes de controllers, use cases e queries.
- `docker`: Dockerfile do backend e SQL inicial do PostgreSQL.

## Stack principal

- Node.js/TypeScript.
- Fastify como servidor HTTP principal em `src/main.ts`.
- PostgreSQL via `pg-promise`.
- Jest com `ts-jest` para testes.
- Docker Compose para backend e banco.

Ha tambem adaptadores alternativos no codigo, como `ExpressAdapter`, `AxiosAdapter`, `FetchAdapter`, repositorios em memoria e loggers diferentes. Prefira o adaptador ja usado pelo ponto de composicao atual antes de trocar infraestrutura.

## Comandos uteis

Instalar dependencias:

```bash
npm install
```

Subir os containers:

```bash
npm run docker:compose:up
```

Subir reconstruindo imagens:

```bash
npm run docker:compose:up:build
```

Entrar no container do backend:

```bash
npm run docker:compose:exec:backend
```

Derrubar containers e volume do banco:

```bash
npm run docker:compose:down
```

Rodar testes:

```bash
npm test
```

Checar TypeScript sem emitir arquivos:

```bash
npm run typecheck
```

Rodar a API localmente:

```bash
npm run dev
```

Compilar TypeScript:

```bash
npm run build
```

Rodar a versao compilada:

```bash
npm start
```

Se adicionar ou alterar scripts de `dev`, `test`, `build`, `start` ou `typecheck`, mantenha esta documentacao atualizada.

## Configuracao de ambiente

Use `.env.example` como base para `.env`.

O `docker-compose.yml` espera:

- `SERVER_PORT`
- `DATABASE_HOST`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_NAME`
- `DATABASE_PORT`

O `src/main.ts` atualmente injeta o banco com `process.env.DATABASE_URL`. Ao rodar a aplicacao, garanta que `DATABASE_URL` exista ou ajuste a composicao/configuracao de ambiente de forma consistente. Em Docker, uma URL tipica seria parecida com:

```env
DATABASE_URL=postgres://user:password@database:5432/hotel
```

Fora do Docker, o host provavelmente sera `localhost`, dependendo de como o PostgreSQL estiver exposto.

## Banco de dados

O schema inicial fica em `docker/database/init.sql`. Ele cria o schema `hotel` e as tabelas:

- `hotel.guests`
- `hotel.rooms`
- `hotel.reservations`

Ao alterar persistencia, mantenha SQL, repositorios de banco e testes alinhados. Evite mudar o schema sem documentar o impacto no `init.sql` e nos dados esperados pelos testes.

## Ponto de composicao

O arquivo `src/main.ts` e o composition root da aplicacao. Ele:

- carrega `dotenv/config`;
- instancia `FastifyAdapter`, `AxiosAdapter`, `InMemoryEventBus` e `PinoLogger`;
- registra dependencias no `Registry`;
- registra repositorios concretos de banco;
- registra use cases e query handlers;
- instancia controllers para registrar rotas;
- inicia o servidor na porta `SERVER_PORT`.

Para novas funcionalidades, prefira registrar dependencias no `main.ts` apenas quando elas precisarem existir em runtime. Em testes, use composicoes locais com repositorios em memoria quando possivel.

## Padroes de codigo

- Mantenha regras de negocio em `src/domain` e `src/application`.
- Mantenha detalhes de framework, HTTP, banco e bibliotecas externas em `src/infra`.
- Use interfaces de repositorio do dominio para contratos e implementacoes em `src/infra/repositories`.
- Use value objects para validacoes de dados importantes, seguindo exemplos como `Email`, `Cpf`, `Password`, `Uuid` e `ReservationPeriod`.
- Use entidades para comportamento de negocio, seguindo exemplos como `Guest`, `Room` e `Reservation`.
- Use eventos de dominio quando uma acao de negocio precisa disparar efeitos posteriores, como `ReservationCreated` e `ReservationCancelled`.
- Preserve o estilo atual de classes, metodos `execute(input)`, DTOs `Input`/`Output` locais e injecao via decorator `@inject`.
- O TypeScript esta em modo `strict`; evite relaxar tipos globais para contornar erros.

## Rotas HTTP atuais

As chamadas de exemplo ficam em `api.rest`.

- `GET /health`
- `POST /guests`
- `GET /guests/:id`
- `POST /rooms`
- `GET /rooms/:id`
- `POST /reservations`
- `PUT /reservations/:id/cancel`
- `GET /reservations/:id`

Ao adicionar rotas, siga o padrao dos controllers em `src/infra/http/controllers`: injete o `HttpServer` e o caso de uso necessario, registre a rota no construtor e delegue a regra de negocio para a application layer.

## Testes

Use testes unitarios para comportamento puro de dominio e value objects. Use testes de feature para use cases, controllers, queries e integracoes entre camadas.

Antes de finalizar mudancas relevantes, rode pelo menos:

```bash
npm test
npm run typecheck
```

Se a mudanca envolver Docker, banco ou bootstrap da API, valide tambem com Docker Compose quando viavel.

## Manutencao do AGENTS.md

Sempre que uma mudanca significativa alterar comandos, scripts, arquitetura, estrutura de pastas, variaveis de ambiente, fluxo de execucao, rotas, padroes de teste, padroes de codigo ou decisoes operacionais relevantes, atualize este `AGENTS.md` na mesma mudanca.

Antes de finalizar uma tarefa significativa, faca este checklist:

- Os comandos documentados continuam corretos?
- A estrutura de pastas descrita ainda representa o projeto?
- As variaveis de ambiente documentadas continuam completas?
- As rotas listadas continuam atuais?
- Os comandos de teste, build e typecheck continuam validos?
- Alguma nova convencao ou cuidado deveria ser registrado para futuros agentes?

Se a tarefa nao exigir mudanca neste arquivo, mencione isso na resposta final quando for relevante.

## Regras para agentes de IA

- Leia este arquivo antes de editar o projeto.
- Nao reverta alteracoes existentes do usuario.
- Prefira os padroes ja presentes no repositorio em vez de introduzir novas abstracoes.
- Mantenha mudancas pequenas e relacionadas ao pedido.
- Nao mova codigo entre camadas sem necessidade clara.
- Nao coloque regra de negocio em controllers ou adaptadores de infraestrutura.
- Atualize testes quando alterar comportamento.
- Atualize `api.rest` quando adicionar ou mudar endpoints.
- Atualize `.env.example` quando adicionar ou renomear variaveis de ambiente.
- Siga o checklist de manutencao do `AGENTS.md` antes de finalizar mudancas significativas.
