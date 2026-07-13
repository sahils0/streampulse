# StreamPulse API Service 🛠️

This is the backend service for StreamPulse, built with Node.js, Express, and TypeScript. It handles authentication, monitor management (CRUD), and the core health-checking engine.

---

## 🚀 Getting Started

### 1. Prerequisites
- **pnpm**: This project uses pnpm workspaces.
- **Docker**: Required for running the database (PostgreSQL + TimescaleDB).

### 2. Infrastructure Setup (Docker)
The database is managed via Docker Compose. From the **project root**, run:

```bash
# Start the database
pnpm db

# Stop the database
pnpm db:down
```

The database includes TimescaleDB extensions for efficient metrics storage.

### 3. Environment Configuration
Copy the `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

**Note on JWT Keys:** This project uses RS256 (Asymmetric) JWTs. You need to generate a RSA key pair and base64-encode them for the `.env` file. Instructions are provided inside `.env.example`.

### 4. Package Installation
To install dependencies for the API service:

```bash
# From the project root
pnpm install

# Or specifically for the API
pnpm --filter api install
```

---

## 🛠️ Development Workflow

### Running the API
To start the API in development mode with auto-reload:

```bash
# From the project root
pnpm dev:api

# Or from within apps/api
pnpm dev
```

### Running Tests
We use **Jest** and **Supertest** for integration testing.

```bash
# Run all tests
npx jest

# Run with coverage
npx jest --coverage

# Run a specific test file
npx jest tests/monitor.test.ts
```

**Crucial:** Ensure the database is running (`pnpm db`) before running tests, as they perform real database operations.

---

## 📂 Project Structure

```bash
apps/api/src/
├── db/            # Database pool and connection logic
├── middleware/    # Express middlewares (Auth, etc.)
├── routes/        # API route definitions (Zod validation happens here)
├── services/      # Business logic (DB queries, Auth logic)
├── workers/       # Background workers (Health Checker)
└── index.ts       # Entry point (Server & Worker initialization)
```

### Key Components:
- **Auth Service**: Handles RS256 JWT generation and verification.
- **Monitor Service**: Manages CRUD for health monitors.
- **Checker Worker**: A `node-cron` driven background job that periodically checks the health of registered URLs using `axios`.

---

## 🧪 Testing Strategy
Tests are located in the `tests/` directory.
- `setup.ts`: Configures the testing environment (loads `.env`).
- `monitor.test.ts`: Integration tests for the Monitor CRUD API.

When adding new endpoints, always add a corresponding integration test to ensure reliability.
