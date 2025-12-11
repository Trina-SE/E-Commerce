# E-Commerce – Local Development & DevOps Setup

This repository contains a React frontend, an API gateway, and multiple Node.js microservices (auth, products, orders, payments, users, complaints). The goal of this update is to provide local orchestration, CI, and documentation without changing the business logic or deploying to production yet.

## Environment setup

1. Copy `.env.example` to `.env` and adjust values as needed. Never commit secrets.
2. (Frontend only) Copy `frontend/.env.example` to `frontend/.env` when running the frontend directly.
3. Ensure Node.js 18+ and npm are installed if you are not using Docker.

## Git Flow & Branches

**Long-lived branches**
- `main`: production-ready code.
- `release`: stabilization for the next production release.
- `staging`: pre-production system testing.
- `testing`: QA/integration testing.
- `dev`: daily integration branch for completed feature work.

**Short-lived branches**
- `feature/*`: new features; branch from `main`, merge into `dev`.
- `hotfix/*`: urgent production fixes; branch from `main`, merge back into `main`.

**Flow**
- Normal: `feature/*` → `dev` → `testing` → `staging` → `release` → `main`
- Hotfix: `hotfix/*` → `main`

**Example commands**
```bash
git checkout -b dev origin/main
git checkout -b testing origin/dev
git checkout -b staging origin/testing
git checkout -b release origin/staging
git checkout -b feature/my-feature main
git checkout -b hotfix/issue-123 main
```

**Baseline branch creation**

This repository now includes local branch placeholders (`main`, `release`, `staging`, `testing`, and `dev`) to align with the Git Flow model. Push them to GitHub once remotes are configured:

```bash
git push -u origin main release staging testing dev
```

## Running without Docker

1. Install dependencies across all projects:
   ```bash
   npm install
   npm run install:all
   ```
2. Start backing services (MongoDB, MinIO) separately or via the Docker Compose local file.
3. Start the API gateway and each microservice (in separate terminals):
   ```bash
   cd gateway && npm run dev
   cd services/auth && npm run dev
   cd services/products && npm run dev
   cd services/orders && npm run dev
   cd services/payments && npm run dev
   cd services/users && npm run dev
   cd services/complaints && npm run dev
   ```
4. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. Open the frontend at http://localhost:3000. The gateway listens on http://localhost:5000.

## Running with Docker

1. Create your `.env` file (see `.env.example`).
2. Build and start everything locally (frontend on port `8080`, gateway/API on port `5000`, MinIO console on `9001`):
   ```bash
   docker compose -f infra/docker-compose.local.yml up --build
   ```
3. Open the app at http://localhost:8080. API routes are available via http://localhost:5000/api.
4. For a production-like layout (no bind mounts), use `infra/docker-compose.prod.yml`. This is intended for future server use and does not deploy anywhere yet.

## Monitoring (optional)

Spin up Prometheus, Grafana, and node-exporter locally:
```bash
docker compose -f infra/docker-compose.monitoring.yml up -d
```
Prometheus: http://localhost:9090, Grafana: http://localhost:3000, node-exporter: http://localhost:9100.

## Testing and builds

- Frontend build check: `npm run build --prefix frontend`
- Service-level checks: `npm test --if-present` or `npm run build --if-present` within each service directory.
- CI: GitHub Actions runs `app-ci.yml` on pushes/PRs to `dev`, `testing`, `staging`, `release`, and `main` for installs, tests (if present), and frontend build. `docker-build.yml` builds Docker images on pushes to those branches to keep Dockerfiles healthy.

## No deployment yet

There is intentionally **no** deployment workflow. A future "deploy-to-intercloud" workflow can consume `infra/docker-compose.prod.yml` once deployment credentials and hosting are ready.
