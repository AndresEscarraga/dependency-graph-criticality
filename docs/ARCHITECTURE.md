# Architecture

The system is split into three layers: ingest, compute, and experience.

## 1. Ingest

- **Jira adapter** (`packages/jira-adapter`): handles OAuth, pagination, and mapping Jira issue links into internal issue/dependency records.
- **CSV importer**: validates data via zod schemas, enabling offline prototyping.
- **Sync orchestration**: API service enqueues jobs in BullMQ to fetch data, transform, and persist to Postgres.

## 2. Compute

- **Graph engine** (`packages/graph-engine`): builds DAGs, detects cycles, runs CPM forward/backward passes, and computes centrality metrics.
- **Metrics snapshots**: stored in the `metrics` and `scores` tables to track drift over time.
- **Alert evaluator**: compares snapshots to detect rule matches (critical-path slip, elongation, newly critical nodes).

## 3. Experience

- **API service** (`apps/api`): exposes REST endpoints for projects, graph snapshots, integrations, and alert testing.
- **Web app** (`apps/web`): Next.js App Router, React Query for data, Zustand for local state, Cytoscape.js for graph visualization.
- **Notifications**: Slack webhook and SMTP email transport.

## Infrastructure

- **Database**: Postgres with Prisma migrations stored in `infra/migrations`.
- **Containerization**: Docker Compose for local development; deploy via Fly.io (API) and Vercel (web) with Railway/Supabase for Postgres.
- **Observability**: Pino logging, optional OpenTelemetry exporters, and PostHog for product analytics.

## Data Flow

1. User connects Jira project via OAuth.
2. Sync job fetches issues and dependencies, storing them in Postgres.
3. Graph engine builds DAG, computes CPM metrics, and writes `metrics`/`scores` tables.
4. Alert evaluator compares previous snapshot; matching rules push Slack/email notifications.
5. Web app fetches graph/metrics via API, renders Cytoscape graph with filtering controls.

## Future Enhancements

- Additional tracker adapters (Linear, Asana).
- Monte Carlo risk simulation on top of CPM results.
- Scenario planning (“what if we reassign or accelerate a task?”).
