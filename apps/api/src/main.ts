import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { buildDag, criticalPath, computeCriticalityScores } from '@depgraph/graph-engine';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = Number(process.env.PORT ?? 4000);

const csvSchema = z.object({
  issues: z.array(z.object({
    id: z.string(),
    durationMinutes: z.number(),
  })),
  dependencies: z.array(z.object({
    from: z.string(),
    to: z.string(),
  })),
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/graph/compute', (req, res) => {
  const parse = csvSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }
  const dag = buildDag(parse.data.issues, parse.data.dependencies);
  const cp = criticalPath(dag);
  const scores = computeCriticalityScores(dag, cp);
  res.json({
    metrics: {
      projectDurationMinutes: cp.projectDuration,
      criticalPath: cp.criticalPath,
    },
    scores,
  });
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
