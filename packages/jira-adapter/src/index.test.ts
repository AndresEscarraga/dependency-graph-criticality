import { describe, expect, it } from 'vitest';
import { JiraAdapter } from './index';

describe('JiraAdapter', () => {
  it('normalizes issues', () => {
    const adapter = new JiraAdapter({ baseUrl: 'https://example.atlassian.net', accessToken: 'token' });
    const normalized = adapter.normalizeIssue({
      id: '1000',
      key: 'DEMO-1',
      self: 'https://example.atlassian.net/rest/api/3/issue/1000',
      fields: {
        summary: 'Implement feature',
        status: { name: 'In Progress' },
        assignee: { displayName: 'Alex' },
        duedate: '2024-05-20',
        timetracking: { remainingEstimateSeconds: 7200 },
        issuelinks: [
          {
            type: { name: 'Blocks' },
            outwardIssue: { key: 'DEMO-2' },
          },
        ],
      },
    } as any);

    expect(normalized.key).toBe('DEMO-1');
    expect(normalized.estimateMinutes).toBe(120);
    expect(normalized.links[0].targetKey).toBe('DEMO-2');
  });
});
