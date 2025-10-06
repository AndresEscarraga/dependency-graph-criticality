import type { ReactNode } from 'react';

export interface PanelProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function Panel({ title, description, children }: PanelProps) {
  return (
    <section style={{ border: '1px solid rgba(148, 163, 184, 0.2)', padding: '1rem', borderRadius: 12 }}>
      <header style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
        {description && <p style={{ margin: 0, color: 'rgba(148, 163, 184, 0.9)' }}>{description}</p>}
      </header>
      <div>{children}</div>
    </section>
  );
}
