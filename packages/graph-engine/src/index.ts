export interface IssueNode {
  id: string;
  key?: string;
  title?: string;
  durationMinutes: number;
  startDate?: string;
  dueDate?: string;
  data?: Record<string, unknown>;
}

export interface DependencyEdge {
  from: string;
  to: string;
  type?: 'blocks' | 'relates' | string;
}

export interface Dag {
  nodes: Map<string, IssueNode>;
  successors: Map<string, string[]>;
  predecessors: Map<string, string[]>;
}

export interface CriticalPathNodeMetrics {
  id: string;
  earliestStart: number;
  earliestFinish: number;
  latestStart: number;
  latestFinish: number;
  totalFloat: number;
  isOnCriticalPath: boolean;
}

export interface CriticalPathResult {
  order: string[];
  projectDuration: number;
  nodeMetrics: Map<string, CriticalPathNodeMetrics>;
  criticalPath: string[];
}

export interface CriticalityScoreInput {
  wOnCriticalPath?: number;
  wFloat?: number;
  wBetweenness?: number;
  wIndegree?: number;
}

export interface CriticalityScore {
  id: string;
  score: number;
  normalizedFloat: number;
  betweenness: number;
  indegree: number;
  outdegree: number;
  isOnCriticalPath: boolean;
}

const MINUTES_IN_DAY = 60 * 24;

export function buildDag(nodes: IssueNode[], edges: DependencyEdge[]): Dag {
  const nodeMap = new Map<string, IssueNode>();
  const successors = new Map<string, string[]>();
  const predecessors = new Map<string, string[]>();

  for (const node of nodes) {
    if (nodeMap.has(node.id)) {
      throw new Error(`Duplicate node id detected: ${node.id}`);
    }
    nodeMap.set(node.id, node);
    successors.set(node.id, []);
    predecessors.set(node.id, []);
  }

  for (const edge of edges) {
    if (!nodeMap.has(edge.from) || !nodeMap.has(edge.to)) {
      throw new Error(`Edge references missing node: ${edge.from} -> ${edge.to}`);
    }
    successors.get(edge.from)!.push(edge.to);
    predecessors.get(edge.to)!.push(edge.from);
  }

  const dag: Dag = { nodes: nodeMap, successors, predecessors };
  detectCycles(dag);
  return dag;
}

export function detectCycles(dag: Dag): void {
  const visited = new Set<string>();
  const visiting = new Set<string>();

  const dfs = (nodeId: string) => {
    if (visiting.has(nodeId)) {
      throw new Error(`Cycle detected involving ${nodeId}`);
    }
    if (visited.has(nodeId)) {
      return;
    }
    visiting.add(nodeId);
    for (const succ of dag.successors.get(nodeId) ?? []) {
      dfs(succ);
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
  };

  for (const id of dag.nodes.keys()) {
    dfs(id);
  }
}

export function topologicalOrder(dag: Dag): string[] {
  const indegree = new Map<string, number>();
  for (const id of dag.nodes.keys()) {
    indegree.set(id, (dag.predecessors.get(id) ?? []).length);
  }
  const queue: string[] = [];
  for (const [id, degree] of indegree.entries()) {
    if (degree === 0) queue.push(id);
  }
  const order: string[] = [];
  let index = 0;
  while (index < queue.length) {
    const node = queue[index++];
    order.push(node);
    for (const succ of dag.successors.get(node) ?? []) {
      const next = (indegree.get(succ) ?? 0) - 1;
      indegree.set(succ, next);
      if (next === 0) queue.push(succ);
    }
  }
  if (order.length !== dag.nodes.size) {
    throw new Error('Cycle detected during topological sort');
  }
  return order;
}

export function criticalPath(dag: Dag): CriticalPathResult {
  const order = topologicalOrder(dag);
  const earliestStart = new Map<string, number>();
  const earliestFinish = new Map<string, number>();

  for (const nodeId of order) {
    const node = dag.nodes.get(nodeId)!;
    const preds = dag.predecessors.get(nodeId) ?? [];
    const es = preds.reduce((max, pred) => Math.max(max, earliestFinish.get(pred) ?? 0), 0);
    const duration = node.durationMinutes;
    const ef = es + duration;
    earliestStart.set(nodeId, es);
    earliestFinish.set(nodeId, ef);
  }

  const projectDuration = Math.max(...order.map((id) => earliestFinish.get(id) ?? 0), 0);
  const latestStart = new Map<string, number>();
  const latestFinish = new Map<string, number>();

  for (let i = order.length - 1; i >= 0; i -= 1) {
    const nodeId = order[i];
    const node = dag.nodes.get(nodeId)!;
    const succs = dag.successors.get(nodeId) ?? [];
    const lf = succs.length === 0
      ? projectDuration
      : Math.min(...succs.map((succ) => latestStart.get(succ) ?? projectDuration));
    const ls = lf - node.durationMinutes;
    latestFinish.set(nodeId, lf);
    latestStart.set(nodeId, ls);
  }

  const nodeMetrics = new Map<string, CriticalPathNodeMetrics>();
  const criticalPath: string[] = [];

  for (const nodeId of order) {
    const es = earliestStart.get(nodeId)!;
    const ef = earliestFinish.get(nodeId)!;
    const ls = latestStart.get(nodeId)!;
    const lf = latestFinish.get(nodeId)!;
    const totalFloat = ls - es;
    const isCritical = Math.abs(totalFloat) < 1e-6;
    if (isCritical) {
      criticalPath.push(nodeId);
    }
    nodeMetrics.set(nodeId, {
      id: nodeId,
      earliestStart: es,
      earliestFinish: ef,
      latestStart: ls,
      latestFinish: lf,
      totalFloat,
      isOnCriticalPath: isCritical,
    });
  }

  return { order, projectDuration, nodeMetrics, criticalPath };
}

export function betweennessCentrality(dag: Dag): Map<string, number> {
  const centrality = new Map<string, number>();
  for (const id of dag.nodes.keys()) {
    centrality.set(id, 0);
  }
  const nodes = Array.from(dag.nodes.keys());

  for (const s of nodes) {
    const stack: string[] = [];
    const predecessors = new Map<string, string[]>();
    const sigma = new Map<string, number>();
    const distance = new Map<string, number>();
    const queue: string[] = [];

    for (const v of nodes) {
      predecessors.set(v, []);
      sigma.set(v, 0);
      distance.set(v, -1);
    }
    sigma.set(s, 1);
    distance.set(s, 0);
    queue.push(s);

    while (queue.length > 0) {
      const v = queue.shift()!;
      stack.push(v);
      for (const w of dag.successors.get(v) ?? []) {
        if ((distance.get(w) ?? -1) < 0) {
          distance.set(w, (distance.get(v) ?? 0) + 1);
          queue.push(w);
        }
        if ((distance.get(w) ?? 0) === (distance.get(v) ?? 0) + 1) {
          sigma.set(w, (sigma.get(w) ?? 0) + (sigma.get(v) ?? 0));
          predecessors.get(w)!.push(v);
        }
      }
    }

    const delta = new Map<string, number>();
    for (const v of nodes) delta.set(v, 0);

    while (stack.length > 0) {
      const w = stack.pop()!;
      for (const v of predecessors.get(w) ?? []) {
        const coeff = ((sigma.get(v) ?? 0) / (sigma.get(w) || 1)) * (1 + (delta.get(w) ?? 0));
        delta.set(v, (delta.get(v) ?? 0) + coeff);
      }
      if (w !== s) {
        centrality.set(w, (centrality.get(w) ?? 0) + (delta.get(w) ?? 0));
      }
    }
  }

  const n = nodes.length;
  const normalization = n > 2 ? 1 / ((n - 1) * (n - 2)) : 1;
  for (const node of nodes) {
    centrality.set(node, (centrality.get(node) ?? 0) * normalization);
  }
  return centrality;
}

export function computeCriticalityScores(
  dag: Dag,
  metrics: CriticalPathResult,
  { wOnCriticalPath = 0.5, wFloat = 0.25, wBetweenness = 0.15, wIndegree = 0.1 }: CriticalityScoreInput = {},
): CriticalityScore[] {
  const betweenness = betweennessCentrality(dag);
  const indegree = new Map<string, number>();
  const outdegree = new Map<string, number>();

  for (const id of dag.nodes.keys()) {
    indegree.set(id, (dag.predecessors.get(id) ?? []).length);
    outdegree.set(id, (dag.successors.get(id) ?? []).length);
  }

  const floats = Array.from(metrics.nodeMetrics.values()).map((m) => m.totalFloat);
  const maxFloat = floats.length ? Math.max(...floats) : 0;

  const indegrees = Array.from(indegree.values());
  const maxIn = indegrees.length ? Math.max(...indegrees) : 1;

  const scores: CriticalityScore[] = [];
  for (const id of dag.nodes.keys()) {
    const nodeMetric = metrics.nodeMetrics.get(id)!;
    const floatNormalized = maxFloat > 0 ? 1 - nodeMetric.totalFloat / maxFloat : 1;
    const betweennessScore = betweenness.get(id) ?? 0;
    const indegreeScore = maxIn > 0 ? (indegree.get(id) ?? 0) / maxIn : 0;
    const critical = nodeMetric.isOnCriticalPath ? 1 : 0;
    const score = wOnCriticalPath * critical
      + wFloat * floatNormalized
      + wBetweenness * betweennessScore
      + wIndegree * indegreeScore;
    scores.push({
      id,
      score,
      normalizedFloat: floatNormalized,
      betweenness: betweennessScore,
      indegree: indegree.get(id) ?? 0,
      outdegree: outdegree.get(id) ?? 0,
      isOnCriticalPath: nodeMetric.isOnCriticalPath,
    });
  }

  return scores.sort((a, b) => b.score - a.score);
}

export function minutesToDays(value: number): number {
  return value / MINUTES_IN_DAY;
}

export function formatCriticalPathSummary(result: CriticalPathResult): string {
  const days = minutesToDays(result.projectDuration).toFixed(2);
  const nodes = result.criticalPath.join(' -> ');
  return `Critical path length: ${days} days\nNodes: ${nodes}`;
}
