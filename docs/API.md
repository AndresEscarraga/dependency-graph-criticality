# API Reference (MVP)

## Authentication

- User authentication handled via NextAuth session cookies (GitHub/Google providers).
- API tokens (Bearer) for programmatic access are planned but not part of the MVP.

## REST Endpoints

### `POST /api/integrations/jira/connect`
Starts the OAuth dance with Jira. Returns an authorization URL for the user to visit.

### `GET /api/integrations/jira/callback`
Handles OAuth callback, stores credentials encrypted, and schedules an initial sync job.

### `POST /api/projects`
Create a project and associate it with the authenticated user.

### `GET /api/projects/:id/graph`
Returns the latest graph snapshot including nodes, edges, metrics, and node scores.

### `POST /api/projects/:id/sync`
Enqueues a Jira sync job.

### `POST /api/projects/:id/alerts/test`
Sends a test alert to configured webhooks.

### `POST /api/webhooks`
Register Slack or email webhooks for alerts.

## Response Shapes

```json
{
  "nodes": [
    {
      "id": "ISSUE:PAY-132",
      "key": "PAY-132",
      "title": "Migrate webhook",
      "status": "In Progress",
      "assignee": "Alex",
      "onCriticalPath": true,
      "totalFloatDays": 0,
      "criticalityScore": 0.86
    }
  ],
  "edges": [
    {
      "from": "ISSUE:PAY-127",
      "to": "ISSUE:PAY-132",
      "type": "blocks"
    }
  ],
  "metrics": {
    "cpLengthDays": 25,
    "nodesOnCriticalPath": 7,
    "computedAt": "2024-05-12T19:20:00Z"
  }
}
```

## Pagination & Filtering

Future iteration will expose filters (status, labels, teams) and pagination for large portfolios.
