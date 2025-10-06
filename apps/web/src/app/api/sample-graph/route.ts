import { NextResponse } from 'next/server';
import sample from '../../../data/sample-data.json';
import { buildDag, criticalPath, computeCriticalityScores } from '@depgraph/graph-engine';

export function GET() {
  const dag = buildDag(
    sample.issues.map((issue) => ({
      id: issue.id,
      durationMinutes: issue.estimateMinutes ?? 60,
      title: issue.title,
    })),
    sample.dependencies.map((edge) => ({
      from: edge.from,
      to: edge.to,
      type: edge.type,
    })),
  );

  const metrics = criticalPath(dag);
  const scores = computeCriticalityScores(dag, metrics);

  return NextResponse.json({
    metrics: {
      projectDurationMinutes: metrics.projectDuration,
      criticalPath: metrics.criticalPath,
    },
    scores,
  });
}
