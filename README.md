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

# Start all infrastructure (Postgres + Kafka + Redis)
pnpm infra

# Start only the database
pnpm db

# Run API
pnpm dev:api

# Run Web
pnpm dev:web

# Run both API + Web
pnpm dev

# List Kafka topics
pnpm kafka:topics

# Consume from a Kafka topic
pnpm kafka:console check-results
```
---


## 📅 Build Progress (4-Week Timeline)

### Week 1 — Core Data Layer + Synchronous Checker
- [x] Day 1 — Monorepo setup (pnpm workspaces), Next.js UI pages, TypeScript + ESLint + .env config
- [x] Day 2 — Docker + PostgreSQL + TimescaleDB, migration files
- [x] Day 3 — Auth service (register/login, bcrypt, RS256 JWT)
- [x] Day 4–5 — Monitor CRUD API + Zod validation + integration tests
- [x] Day 5–7 — Synchronous checker with node-cron + Axios

### Week 2 — Kafka + Redis Layer
- [x] Day 1 — Kafka integration (Bitnami KRaft mode, check-results/alert-events/metrics-raw topics)
- [x] Day 2 — Refactor Checker to Kafka producer + Metrics Worker (batch insert consumer)
- [x] Day 3–4 — Redis rate limiter + cache + pub/sub setup
- [x] Day 5–7 — Cache Warmer Worker

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
> **Week 2 complete.** All data pipeline infrastructure is in place: Kafka producer/consumer (check-results), batch-insert Metrics Worker, Redis rate limiter (sliding window), read-through cache with 30s TTL, pub/sub event bus, and Cache Warmer Worker (scheduled + event-driven). Run `pnpm infra` to start Postgres + Kafka + Redis. Next: Week 3 — Alert Worker, SSE endpoint, and live dashboard.
