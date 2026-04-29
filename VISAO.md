# Hotel System — Project Vision & Roadmap

## Context

Sistema de hotel para hospedagem, desenvolvido com:
- **Clean Architecture**
- **Clean Code**
- **TDD**
- **DDD**
- **CQRS**
- **API REST Full**

---

## 1. Estado Atual do Projeto

### 1.1. Estrutura de Pastas

```
src/
├── domain/
│   ├── entities/          # Room, Guest, Reservation
│   ├── value-objects/     # Uuid, Cpf, Email, Password, ReservationPeriod
│   ├── events/            # DomainEvent, EventBus, EventHandler, ReservationCreated, ReservationCancelled
│   └── repositories/      # Interfaces: RoomRepository, GuestRepository, ReservationRepository, ReservationQueryRepository
├── application/
│   ├── usecases/          # CreateGuest, GetGuest, CreateRoom, GetRoom, CreateReservation, CancelReservation, ListRooms, GetRoom, GetGuest
│   ├── handlers/          # SendEmailOnReservationCreated
│   └── queries/           # GetReservationQueryHandler
├── infra/
│   ├── http/
│   │   ├── server/        # HttpServer (interface), FastifyAdapter, ExpressAdapter
│   │   ├── client/        # HttpClient (interface), AxiosAdapter, FetchAdapter
│   │   └── controllers/   # GuestController, RoomController, ReservationController
│   ├── database/          # DatabaseConnection (interface), PgPromiseAdapter
│   ├── repositories/      # RoomRepositoryDatabase, GuestRepositoryDatabase, ReservationRepositoryDatabase, ReservationQueryRepositoryDatabase
│   ├── events/            # InMemoryEventBus
│   └── di/                # Registry (singleton + @inject decorator)
└── main.ts                # Composition root
```

### 1.2. Dependências

| Pacote | Versão | Uso |
|---|---|---|
| `fastify` | ^5.8.5 | HTTP server |
| `express` | ^5.2.1 | HTTP server (alternativo) |
| `@fastify/cors` | ^11.2.0 | CORS |
| `@fastify/helmet` | ^13.0.2 | Segurança de headers (instalado, **não utilizado**) |
| `@fastify/formbody` | ^8.0.2 | Form body parsing |
| `pg-promise` | ^12.6.2 | PostgreSQL |
| `axios` | ^1.15.2 | HTTP client |
| `dotenv` | ^17.4.2 | Env variables |
| `jest` / `ts-jest` | ^30+ | Testing |
| `nodemon` | ^3.1.14 | Dev reload |

### 1.3. Domínio Modelado

#### Entities
| Entity | Atributos | Comportamentos |
|---|---|---|
| **Room** | uuid, number, capacity, pricePerNight, status | occupy(), available() |
| **Guest** | uuid, name, email, document (CPF), password | — |
| **Reservation** | uuid, roomId, guestId, period, status, domainEvents | cancel(reason, cancelledBy), getTotalNights(), getTotalPrice() |

#### Value Objects
| VO | Validação |
|---|---|
| **Uuid** | Regex UUID v4 |
| **Cpf** | Validação de CPF |
| **Email** | Validação de email |
| **Password** | Validação de senha |
| **ReservationPeriod** | Check-in < Check-out |

#### Domain Events
| Event | Quando disparado |
|---|---|
| `ReservationCreated` | Ao criar reserva |
| `ReservationCancelled` | Ao cancelar reserva |

#### Repositórios (Interfaces)
| Repositório | Métodos |
|---|---|
| `RoomRepository` | save, findByUuid, findByNumber, list |
| `GuestRepository` | save, findByUuid, findByEmail, findByCpf |
| `ReservationRepository` | save, findByUuid, hasConflict |
| `ReservationQueryRepository` | findByUuid (CQRS read side) |

---

## 2. O que já existe ✅

| Conceito | Status | Observação |
|---|---|---|
| **Clean Architecture** | ✅ | Layers Domain → Application → Infra bem separados |
| **DDD** | ✅ | Entities, Value Objects, Domain Events, EventBus |
| **CQRS** | ⚠️ Parcial | Apenas `Reservation` tem QueryRepository separado |
| **DI Container** | ✅ | Registry singleton com decorator `@inject` |
| **Ports & Adapters** | ✅ | HttpServer, HttpClient, DatabaseConnection como interfaces |
| **TDD** | ✅ | Testes unitários + feature/integração com Jest |
| **Docker Compose** | ✅ | App + Postgres com init.sql |
| **CORS** | ✅ Básico | `origin: true` — aceita tudo |
| **Event Sourcing (Domain Events)** | ✅ | Entidades acumulam eventos, EventBus publica |
| **Repository Pattern** | ✅ | Interfaces no domain, implementações no infra |

---

## 3. Camada de Logging — Missing Layer 🔴

### 3.1. Problema Atual

- `FastifyAdapter`: usa `this.app.log.error()` apenas em errors
- `ExpressAdapter`: usa `console.error()`
- `SendEmailOnReservationCreated`: usa `console.log()`
- **Sem** logging estruturado, sem correlation ID, sem níveis (debug, info, warn, error), sem log de requests/responses

### 3.2. Arquitetura Proposta

```
src/
├── domain/
│   └── logging/
│       └── Logger.ts                    # Interface (port)
├── application/
│   └── logging/
│       └── LoggerAdapter.ts             # (opcional) Adapter para usecases
└── infra/
    └── logging/
        ├── PinoLogger.ts                # Implementação com Pino
        ├── RequestLogger.ts             # Middleware de request/response logging
        └── LogCorrelationId.ts          # Correlation ID por request
```

#### Interface `Logger` (Domain Port)

```typescript
interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  child(context: Record<string, unknown>): Logger;
}
```

#### Implementação (`PinoLogger`)

```typescript
class PinoLogger implements Logger {
  private logger: pino.Logger;

  constructor(level = 'info') {
    this.logger = pino({ level, transport: { target: 'pino-pretty' } });
  }

  debug(msg, ctx) { this.logger.debug(ctx, msg); }
  info(msg, ctx) { this.logger.info(ctx, msg); }
  warn(msg, ctx) { this.logger.warn(ctx, msg); }
  error(msg, ctx) { this.logger.error(ctx, msg); }
  child(ctx) { return new PinoLogger(this.logger.child(ctx)); }
}
```

#### Request Logger (Middleware no Fastify/Express)

- Log de **entrada**: `method`, `url`, `correlationId`, `timestamp`
- Log de **saída**: `statusCode`, `responseTime`, `correlationId`
- Log de **erro**: `statusCode`, `error`, `stack`, `correlationId`

#### Correlation ID

- Gerado por request (`uuid`)
- Propagado via header `X-Correlation-Id`
- Presente em **todos** os logs da cadeia do request
- Propagado para chamadas HTTP externas (HttpClient)

#### O que Logar

| Camada | O que logar |
|---|---|
| **HTTP Server** | Method, URL, status, response time, correlation ID |
| **Controllers** | Input recebido, validações falhas |
| **Use Cases** | Início/fim da execução, decisões de negócio, erros |
| **Repositories** | Queries executadas (debug), erros de DB, tempo de query |
| **EventBus** | Evento publicado, handler executado, erros |
| **HttpClient** | URL chamada, status response, tempo, retry attempts |
| **Database** | Conexão aberta/fechada, pool stats |

#### Níveis de Log

| Nível | Quando usar | Exemplo |
|---|---|---|
| `DEBUG` | Queries SQL, detalhes internos | `SELECT * FROM rooms WHERE...` |
| `INFO` | Fluxo normal | `Reservation created: id=xyz` |
| `WARN` | Situação anormal mas recuperável | `Room already booked, retrying` |
| `ERROR` | Falha que impede operação | `Database connection lost` |
| `FATAL` | Falha crítica — processo deve parar | `Cannot bind to port` |

#### Dependências Sugeridas

| Pacote | Finalidade |
|---|---|
| `pino` | Logger estruturado (JSON) |
| `pino-pretty` | Output legível em dev |
| `pino-http` | Auto-instrumentação de requests HTTP |
| `redact` (built-in pino) | Redação de dados sensíveis (senha, CPF) |

---

## 4. O que Falha — Roadmap Completo

### 4.1. Críticos (P0 — Fazer agora)

| # | Item | Descrição | Esforço |
|---|---|---|---|
| 1 | **Health Check** | `GET /health` com status do DB, uptime, timestamp | Baixo |
| 2 | **Logging** | Logger interface, PinoLogger, request middleware, correlation ID | Médio |
| 3 | **Autenticação** | JWT, login, refresh token, middleware de auth | Alto |
| 4 | **Autorização / RBAC** | Roles (guest, admin, receptionist), guards | Médio |
| 5 | **Validação de Input** | DTOs validados no controller (ex: zod, class-validator) | Médio |
| 6 | **Tratamento de Erros** | RFC 7807 (Problem Details), HTTP status corretos, AppError | Médio |
| 7 | **Graceful Shutdown** | Fechar DB pool, drain HTTP connections, signal handlers | Baixo |
| 8 | **Transações / Unit of Work** | Atomicidade em `CreateReservation`, `CancelReservation` | Médio |

### 4.2. Infraestrutura (P1 — Fazer em seguida)

| # | Item | Descrição | Esforço |
|---|---|---|---|
| 9 | **RabbitMQ** | Substituir `InMemoryEventBus` por `RabbitMQEventBus` | Alto |
| 10 | **Retry Pattern** | Retry exponencial para falhas transitórias (DB, MQ, HTTP) | Médio |
| 11 | **Circuit Breaker** | Proteger chamadas externas (email, pagamento) | Médio |
| 12 | **Fallback Pattern** | Resposta alternativa quando serviço downstream falha | Médio |
| 13 | **Rate Limiting** | Proteção contra abuso por IP/user | Baixo |
| 14 | **Métricas** | Prometheus, health metrics, custom counters | Médio |
| 15 | **Tracing** | OpenTelemetry, distributed tracing | Alto |

### 4.3. API REST (P2 — Completar API)

| # | Item | Descrição | Esforço |
|---|---|---|---|
| 16 | **CRUD Rooms** | `GET /rooms`, `PUT /rooms/:id`, `DELETE /rooms/:id` | Baixo |
| 17 | **CRUD Guests** | `GET /guests`, `PUT /guests/:id`, `DELETE /guests/:id` | Baixo |
| 18 | **List Reservations** | `GET /reservations` com filtros | Baixo |
| 19 | **Paginação** | Cursor ou offset-based em todas listagens | Baixo |
| 20 | **API Versioning** | `/api/v1/...` | Baixo |
| 21 | **OpenAPI/Swagger** | Documentação automática | Médio |
| 22 | **ETag / Cache** | Headers de cache para GETs | Baixo |
| 23 | **Idempotency** | `Idempotency-Key` para POST/PUT | Médio |

### 4.4. CQRS (P3 — Evolução)

| # | Item | Descrição | Esforço |
|---|---|---|---|
| 24 | **Query Repositories para Guest/Room** | Separar read models | Médio |
| 25 | **Materialized Views** | Rooms disponíveis por período, dashboard | Médio |
| 26 | **Eventual Consistency** | Sync entre write DB e read DB (se separados) | Alto |
| 27 | **Event Sourcing** | (opcional, avançado) | Alto |

### 4.5. Qualidade & DevOps (P4 — Contínuo)

| # | Item | Descrição | Esforço |
|---|---|---|---|
| 28 | **ESLint + Prettier** | Linting e formatação | Baixo |
| 29 | **Husky + lint-staged** | Pre-commit hooks | Baixo |
| 30 | **CI/CD** | GitHub Actions (test, lint, build) | Médio |
| 31 | **Coverage mínimo** | 80%+ de coverage | Médio |
| 32 | **Dockerfile otimizado** | Multi-stage build, non-root user | Baixo |
| 33 | **Seed / Fixtures** | Dados de exemplo para dev | Baixo |

---

## 5. Bugs & Code Smells Identificados

| # | Local | Problema |
|---|---|---|
| 1 | `FastifyAdapter.ts:10` | `logger: false` — desabilitado, mas `@fastify/helmet` instalado e não usado |
| 2 | `CreateReservation.ts:20-21` | Linhas comentadas de validação (guest/room) — código morto |
| 3 | `ListRooms` | Use case existe mas **não está** no `main.ts` nem exposto em controller |
| 4 | `ReservationController.ts:1` | `import { request } from "axios"` — import não utilizado |
| 5 | `HttpServer.ts` | Interface não passa `request`/`response` objects para callbacks — limita validação |
| 6 | `InMemoryEventBus.ts:16-17` | Publicação sequencial (for..await) — o `CreateReservation` já faz paralelo, mas o EventBus não |
| 7 | `RoomRepositoryDatabase.ts:68` | `list()` retorna `null` se 0 rooms — deveria retornar `[]` |
| 8 | `ExpressAdapter.ts:15` | Não passa `query` params para o callback |
| 9 | `.env` | `DATABASE_URL` usada no main.ts mas não está no `.env.example` |
| 10 | `Registry` | Singleton global — dificulta testes isolados (não há `reset()`) |

---

## 6. Sugestão de Ordem de Implementação

```
Fase 1 — Fundação         → Logging → Health Check → Graceful Shutdown → Tratamento de Erros
Fase 2 — Segurança        → Autenticação JWT → Autorização RBAC → Rate Limiting
Fase 3 — Resiliência      → Retry → Circuit Breaker → Fallback → Transações
Fase 4 — Eventos          → RabbitMQ → Dead Letter Queue → Idempotency
Fase 5 — API Completa     → CRUD completo → Paginação → Versioning → Swagger
Fase 6 — CQRS Avançado    → Read models → Materialized views → Métricas
Fase 7 — DevOps           → ESLint → CI/CD → Coverage → Docker otimizado
```

---

> **Próximo passo**: Definir o que implementar primeiro.
