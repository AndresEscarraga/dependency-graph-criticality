'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DemoGraph } from '@/components/demo-graph';
import { Panel } from '@depgraph/ui';

async function fetchSampleGraph() {
  const response = await fetch('/api/sample-graph');
  if (!response.ok) throw new Error('Failed to load sample graph');
  return response.json();
}

export default function HomePage() {
  const { data, error } = useQuery({ queryKey: ['sample-graph'], queryFn: fetchSampleGraph });

  const summary = useMemo(() => {
    if (!data) return null;
    return `${data.metrics.criticalPath.join(' -> ')} (${(data.metrics.projectDurationMinutes / 60).toFixed(1)}h)`;
  }, [data]);

  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header>
        <h1>Dependency Graph & Criticality Alerts</h1>
        <p>
          Visualize Jira issue dependencies, compute the critical path, and receive proactive alerts when delivery risk spikes.
        </p>
      </header>
      {error && <p style={{ color: '#f87171' }}>Failed to load sample graph.</p>}
      <Panel title="Sample Graph" description="Preview the critical path derived from the demo dataset.">
        <p>Critical path summary: {summary ?? 'Loading…'}</p>
        <DemoGraph data={data} />
      </Panel>
    </main>
  );
}
