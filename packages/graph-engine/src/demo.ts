import { buildDag, computeCriticalityScores, criticalPath, formatCriticalPathSummary, IssueNode, DependencyEdge, minutesToDays } from './index';

const nodes: IssueNode[] = [
  { id: 'ISSUE:ALPHA-1', title: 'Provision database', durationMinutes: 8 * 60 },
  { id: 'ISSUE:ALPHA-2', title: 'Implement API', durationMinutes: 16 * 60 },
  { id: 'ISSUE:ALPHA-3', title: 'QA & Launch', durationMinutes: 8 * 60 },
];

const edges: DependencyEdge[] = [
  { from: 'ISSUE:ALPHA-1', to: 'ISSUE:ALPHA-2', type: 'blocks' },
  { from: 'ISSUE:ALPHA-2', to: 'ISSUE:ALPHA-3', type: 'blocks' },
];

const dag = buildDag(nodes, edges);
const cpResult = criticalPath(dag);
const scores = computeCriticalityScores(dag, cpResult);

console.log(formatCriticalPathSummary(cpResult));
console.log('Project duration (days):', minutesToDays(cpResult.projectDuration).toFixed(2));
console.log('Top criticality scores:');
for (const score of scores) {
  console.log(`- ${score.id}: ${score.score.toFixed(3)} (critical=${score.isOnCriticalPath})`);
}
