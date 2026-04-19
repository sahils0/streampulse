# StreamPulse 🚀
> Real-Time URL & API Health Monitoring Platform

A production-grade, horizontally scalable monitoring platform built with Next.js, Node.js, PostgreSQL, TimescaleDB, Redis, Kafka, and Kubernetes.

---

## 📦 Tech Stack
`Next.js` `Node.js` `PostgreSQL` `TimescaleDB` `Redis` `Kafka` `Docker` `Kubernetes` `TypeScript`

---

## 🗂️ Project Structure
```
streampulse/
├── apps/
│   ├── api/          # Node.js + Express backend
│   └── web/          # Next.js frontend
├── infra/
│   ├── docker/       # docker-compose files
│   └── k8s/          # Kubernetes manifests + HPA
└── db/
    └── migrations/   # SQL migration files
```
---

## 🚀 Getting Started
```bash
# Install dependencies
pnpm install

# Start database
docker compose up -d

# Run API
pnpm --filter api dev

# Run Web
pnpm --filter web dev
```
---


## 📅 Build Progress (4-Week Timeline)

### Week 1 — Core Data Layer + Synchronous Checker
- [x] Day 1 — Monorepo setup (pnpm workspaces), Next.js UI pages, TypeScript + ESLint + .env config
- [x] Day 2 — Docker + PostgreSQL + TimescaleDB, migration files
- [x] Day 3 — Auth service (register/login, bcrypt, RS256 JWT)
- [ ] Day 4–5 — Monitor CRUD API + Zod validation + integration tests
- [ ] Day 5–7 — Synchronous checker with node-cron + Axios

### Week 2 — Kafka + Redis Layer
- [ ] Kafka integration (check-results, alert-events, metrics-raw topics)
- [ ] Metrics Worker (batch insert consumer)
- [ ] Redis rate limiter + cache + pub/sub setup
- [ ] Cache Warmer Worker

### Week 3 — Alerting + SSE + Dashboard
- [ ] Alert Worker with 3-failure debounce logic
- [ ] SSE endpoint (/events) with Redis pub/sub fanout
- [ ] Next.js dashboard with live status badges + sparkline charts

### Week 4 — Kubernetes + Polish
- [ ] Dockerize all services
- [ ] Kubernetes deployments + HPA (scale on Kafka consumer lag)
- [ ] End-to-end testing + performance benchmarks

---

## 📌 Current Status
> **Week 1 — Day 3 complete.** Auth service running with RS256 JWT. Register/login endpoints live. Run `pnpm db` to start Postgres, `pnpm dev` to start the API.