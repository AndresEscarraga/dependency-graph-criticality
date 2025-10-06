# Dependency Graph & Criticality Alerts

Dependency Graph & Criticality Alerts turns issue relationships from Jira projects (or CSV imports) into a directed acyclic graph (DAG), computes critical-path metrics, and proactively alerts program managers when delivery risk increases.

> **Status:** Early scaffold. The project is structured as a pnpm workspace monorepo with separate packages for the web UI, API, shared graph engine, Jira adapter, and UI components.

## Features (MVP scope)

- Jira OAuth 2.0 integration with CSV import fallback.
- Graph engine that detects cycles, runs Critical Path Method (CPM), and produces node criticality scores.
- Next.js-based graph explorer powered by Cytoscape.js with filters and drill-down panels.
- Slack and email alerts for critical-path slips, elongation, and newly critical nodes.
- Export critical-path data as PNG and CSV.

## Repository structure

```
dependency-graph-criticality/
├─ apps/
│  ├─ web/          # Next.js App Router frontend
│  └─ api/          # Express-based API service
├─ packages/
│  ├─ graph-engine/ # Critical path & centrality algorithms
│  ├─ jira-adapter/ # Jira REST API integration helpers
│  └─ ui/           # Shared UI primitives
├─ infra/           # Docker Compose & database migrations
├─ docs/            # Architecture, API, contributing guides
└─ .github/         # CI/CD and templates
```

## Getting started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker (for local Postgres)

### Install dependencies

```bash
pnpm install
```

### Environment configuration

Copy `.env.example` to `.env` and fill in the secrets for Jira and Slack integrations.

```bash
cp .env.example .env
```

### Run the stack locally

```bash
# Start Postgres and supporting services
docker compose up -d

# Start the API service
dotenv -e .env -- pnpm dev:api

# Start the web app
dotenv -e .env -- pnpm dev:web
```

The app will be available at http://localhost:3000 and the API at http://localhost:4000 by default.

### Demo data & graph CLI

A sample dataset (in `docs/sample-data.json`) is provided to test the graph engine without connecting to Jira. To preview the critical path in your terminal:

```bash
pnpm graph:demo
```

## Testing & linting

```bash
pnpm lint
pnpm test
pnpm typecheck
```

CI runs the same set of commands via GitHub Actions.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API reference](docs/API.md)
- [Contributing guide](docs/CONTRIBUTING.md)
- [Release & publishing guide](docs/RELEASE.md)

## License

This project is released under the [MIT License](LICENSE).

## Roadmap

Refer to the GitHub project board and `docs/ROADMAP.md` (coming soon) for milestone planning.
