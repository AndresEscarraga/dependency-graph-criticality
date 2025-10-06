import request from 'supertest';
import { describe, expect, it } from 'vitest';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { buildDag, criticalPath, computeCriticalityScores } from '@depgraph/graph-engine';

// Minimal handler reuse from main
const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.post('/api/graph/compute', (req, res) => {
    const dag = buildDag(req.body.issues, req.body.dependencies);
    const cp = criticalPath(dag);
    const scores = computeCriticalityScores(dag, cp);
    res.json({ metrics: { projectDurationMinutes: cp.projectDuration }, scores });
  });

  return app;
};

describe('POST /api/graph/compute', () => {
  it('returns project metrics', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/graph/compute')
      .send({
        issues: [
          { id: 'A', durationMinutes: 60 },
          { id: 'B', durationMinutes: 30 },
        ],
        dependencies: [
          { from: 'A', to: 'B' },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.metrics.projectDurationMinutes).toBe(90);
    expect(response.body.scores).toHaveLength(2);
  });
});
