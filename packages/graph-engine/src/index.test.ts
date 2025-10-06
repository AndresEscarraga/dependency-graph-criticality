import { describe, expect, it } from 'vitest';
import { buildDag, criticalPath, computeCriticalityScores, betweennessCentrality } from './index';

describe('graph engine', () => {
  const nodes = [
    { id: 'A', durationMinutes: 60 },
    { id: 'B', durationMinutes: 120 },
    { id: 'C', durationMinutes: 60 },
    { id: 'D', durationMinutes: 30 },
  ];
  const edges = [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'A', to: 'D' },
    { from: 'D', to: 'C' },
  ];

  it('computes critical path metrics', () => {
    const dag = buildDag(nodes, edges);
    const result = criticalPath(dag);
    expect(result.projectDuration).toBe(210);
    expect(result.criticalPath).toEqual(['A', 'B', 'C']);
    const metrics = result.nodeMetrics.get('B');
    expect(metrics?.totalFloat).toBe(0);
  });

  it('computes criticality scores', () => {
    const dag = buildDag(nodes, edges);
    const result = criticalPath(dag);
    const scores = computeCriticalityScores(dag, result);
    expect(scores[0].id).toBe('B');
    expect(scores.find((s) => s.id === 'D')).toBeDefined();
  });

  it('computes betweenness centrality', () => {
    const dag = buildDag(nodes, edges);
    const centrality = betweennessCentrality(dag);
    expect(centrality.get('B')).toBeGreaterThan(centrality.get('A') ?? 0);
  });
});
