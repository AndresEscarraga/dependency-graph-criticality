# Contributing Guide

Thank you for considering contributing! The project follows a standard GitHub flow:

1. Fork the repository and create a feature branch.
2. Install dependencies with `pnpm install`.
3. Run `pnpm lint`, `pnpm test`, and `pnpm typecheck` before opening a pull request.
4. Ensure documentation is updated for user-facing changes.
5. Submit a PR describing scope, screenshots (for UI), and tests run.

## Coding Standards

- TypeScript with strict type checking (`tsconfig.base.json`).
- ESLint + Prettier for consistent formatting.
- Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, etc.).

## Testing

- Unit tests live beside implementation files (`*.test.ts`).
- Integration tests are run from `apps/api/tests` using Vitest.
- UI smoke tests use Cypress (planned).

## Pull Request Checklist

- [ ] Tests added/updated
- [ ] Docs updated
- [ ] Linting and type checks pass
- [ ] Added entry to `CHANGELOG.md` when appropriate

## Communication

Join the discussions tab or open a GitHub issue for feature ideas or bug reports.
