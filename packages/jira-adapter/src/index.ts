import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';

const IssueSchema = z.object({
  id: z.string(),
  key: z.string(),
  fields: z.object({
    summary: z.string(),
    status: z.object({ name: z.string() }),
    assignee: z.object({ displayName: z.string() }).nullable(),
    duedate: z.string().nullable().optional(),
    timetracking: z.object({ remainingEstimateSeconds: z.number().nullable().optional() }).optional(),
    issuelinks: z.array(z.unknown()).optional(),
  }),
  self: z.string(),
});

type Issue = z.infer<typeof IssueSchema>;

type JiraSearchResponse = {
  issues: Issue[];
};

export interface JiraAdapterOptions {
  baseUrl: string;
  accessToken: string;
}

export interface NormalizedIssue {
  externalId: string;
  key: string;
  title: string;
  status: string;
  assignee?: string | null;
  dueDate?: string | null;
  estimateMinutes: number;
  url: string;
  links: Array<{ direction: 'outward' | 'inward'; type: string; targetKey: string }>;
}

export class JiraAdapter {
  private client: AxiosInstance;

  constructor(private options: JiraAdapterOptions) {
    this.client = axios.create({
      baseURL: options.baseUrl,
      headers: {
        Authorization: `Bearer ${options.accessToken}`,
        Accept: 'application/json',
      },
    });
  }

  async searchIssues(jql: string): Promise<NormalizedIssue[]> {
    const response = await this.client.get<JiraSearchResponse>('/rest/api/3/search', {
      params: { jql, expand: 'issuelinks', maxResults: 50 },
    });

    return response.data.issues.map((issue) => this.normalizeIssue(issue));
  }

  normalizeIssue(issue: Issue): NormalizedIssue {
    const parsed = IssueSchema.parse(issue);
    const links = (parsed.fields.issuelinks ?? []).map((link: any) => {
      if (link.outwardIssue) {
        return { direction: 'outward' as const, type: link.type?.name ?? 'relates', targetKey: link.outwardIssue.key };
      }
      if (link.inwardIssue) {
        return { direction: 'inward' as const, type: link.type?.name ?? 'relates', targetKey: link.inwardIssue.key };
      }
      return { direction: 'outward' as const, type: 'relates', targetKey: '' };
    });

    const estimateMinutes = Math.round((parsed.fields.timetracking?.remainingEstimateSeconds ?? 0) / 60);

    return {
      externalId: parsed.id,
      key: parsed.key,
      title: parsed.fields.summary,
      status: parsed.fields.status.name,
      assignee: parsed.fields.assignee?.displayName ?? null,
      dueDate: parsed.fields.duedate ?? null,
      estimateMinutes,
      url: parsed.self,
      links,
    };
  }
}
