import './globals.css';
import type { ReactNode } from 'react';
import { QueryProvider } from '@/components/query-provider';

export const metadata = {
  title: 'Dependency Graph & Criticality Alerts',
  description: 'Visualize blockers and critical path risk.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
