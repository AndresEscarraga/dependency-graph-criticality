'use client';

import { memo } from 'react';

interface DemoGraphProps {
  data?: {
    metrics: {
      projectDurationMinutes: number;
      criticalPath: string[];
    };
    scores: Array<{
      id: string;
      score: number;
      isOnCriticalPath: boolean;
      normalizedFloat: number;
    }>;
  };
}

export const DemoGraph = memo<DemoGraphProps>(({ data }) => {
  if (!data) return <p>Loading sample data…</p>;

  return (
    <div style={{ border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: 12, padding: '1rem' }}>
      <p style={{ fontWeight: 500 }}>Critical Path Nodes</p>
      <ol>
        {data.metrics.criticalPath.map((node) => (
          <li key={node}>{node}</li>
        ))}
      </ol>
      <p style={{ fontWeight: 500 }}>Top Scores</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Node</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Score</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Critical</th>
          </tr>
        </thead>
        <tbody>
          {data.scores.slice(0, 5).map((score) => (
            <tr key={score.id}>
              <td>{score.id}</td>
              <td>{score.score.toFixed(3)}</td>
              <td>{score.isOnCriticalPath ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
DemoGraph.displayName = 'DemoGraph';
