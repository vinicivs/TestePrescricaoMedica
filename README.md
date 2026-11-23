# Prescrição Médica Eletrônica

CRUD de prescrição médica: **.NET 9 Web API** (Clean Architecture + OData), **Angular 21** e **MySQL 8.4**, tudo containerizado e com pipelines de CI/CD em GitHub Actions.

## Executar com Docker

```bash
docker compose up -d --build
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API (REST) | http://localhost:8080/api/prescriptions/{id} |
| API (OData) | http://localhost:8080/odata/Prescriptions |
| Documentação (Scalar) | http://localhost:8080/scalar/v1 |
| Health | http://localhost:8080/health/ready |
| MySQL | localhost:3306 (`prescription_app` / `prescription_app_pwd`) |

As portas podem ser alteradas por variáveis de ambiente (veja `.env.example`), por exemplo `API_PORT=8081 docker compose up -d`.

Para recriar o banco do zero (os scripts de `database/init` só rodam na primeira subida):

```bash
docker compose down -v && docker compose up -d --build
```

## Executar sem Docker

```bash
# MySQL
docker compose up -d mysql

# API
cd backend
dotnet test
dotnet run --project src/MedicalPrescription.Api --urls http://localhost:8080

# Frontend (o proxy redireciona /api e /odata para localhost:8080)
cd frontend
npm install
npm start
```

## Estrutura

```
backend/      .NET 9 – Domain, Application, Infrastructure, Api + testes
frontend/     Angular 21 – domain, data, application, presentation
database/     DER e scripts SQL (schema + seed)
deploy/k8s/   Manifests Kubernetes (kustomize)
.github/      Pipelines de CI/CD (build, artefatos, imagem Docker, deploy)
docs/         Enunciado e documentação da solução
```

A explicação completa da solução está em [`docs/SOLUCAO.md`](docs/SOLUCAO.md).
