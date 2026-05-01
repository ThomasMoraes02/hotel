---
name: criar-endpoint
description: Use quando precisar criar, alterar ou revisar endpoints HTTP nesta API de hotelaria TypeScript, incluindo controller, use case, DI, testes, api.rest e validacao em Docker.
---

# Criar Endpoint

Use esta skill para criar ou alterar endpoints HTTP neste projeto.

## Fluxo

1. Leia `AGENTS.md` antes de editar.
2. Identifique o comportamento esperado da rota: metodo, path, input, output, status esperado e regras de negocio.
3. Coloque regra de negocio em `src/domain` ou `src/application`, nunca no controller.
4. Crie ou ajuste o use case em `src/application/usecases` usando o padrao `execute(input)`.
5. Se precisar de persistencia, use contratos em `src/domain/repositories` e implementacoes em `src/infra/repositories`.
6. Crie ou ajuste o controller em `src/infra/http/controllers`.
7. Registre novas dependencias no composition root `src/main.ts`.
8. Atualize `api.rest` com exemplo da nova rota ou alteracao.
9. Adicione ou atualize testes em `test/feature` e, se houver regra pura de dominio, em `test/unit`.
10. Rode validacoes dentro do Docker.
11. Atualize `AGENTS.md` se a mudanca alterar rotas, comandos, arquitetura, env vars ou fluxo operacional.

## Padroes do projeto

- Controllers devem ser finos: recebem request, extraem dados e delegam para use cases.
- Use cases retornam DTOs simples e nao devem depender de Fastify, Express ou Axios.
- Entidades e value objects devem proteger regras do dominio.
- Repositorios de banco usam `DatabaseConnection` e SQL parametrizado.
- Injecao usa `Registry` e decorator `@inject`.
- Testes de controller podem usar `AxiosAdapter`, mas devem rodar com a API iniciada pelo script `npm test`.

## Validacao

Rode do host:

```bash
npm run docker:test
npm run docker:typecheck
```

Ou, se ja estiver dentro do container `backend`:

```bash
npm test
npm run typecheck
```

Se a mudanca tocar compilacao ou runtime de producao, rode tambem:

```bash
npm run docker:build
```

