# Release & Publishing Guide

This document describes the workflow for publishing the Dependency Graph & Criticality Alerts project to GitHub and creating public releases.

## 1. Prepare the release branch

1. Ensure your local `work` branch is up to date with `origin/work`.
2. Run the quality gates locally to guarantee the CI will pass:
   ```bash
   pnpm lint
   pnpm test
   pnpm typecheck
   pnpm build
   ```
3. Update documentation (README, API docs, changelog entries) to reflect the changes included in the release.

## 2. Draft the release notes

1. Summarize the notable features, fixes, and breaking changes since the previous release.
2. Highlight any upgrade or migration steps required by end users.
3. Credit contributors using their GitHub handles when possible.

## 3. Create a pull request

1. Push your branch to GitHub.
2. Open a pull request targeting `main` using the provided PR template.
3. Request reviews from the code owners listed in `CODEOWNERS`.
4. Address review feedback and ensure the PR checks (lint, typecheck, tests) are green.

## 4. Merge and tag

1. Once approved, merge the PR using the "Squash and merge" strategy.
2. Tag the resulting commit with the next semantic version (for example, `v0.1.0`).
3. Push the tag to GitHub:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

## 5. Publish the GitHub release

1. Navigate to the repository's **Releases** tab and click **Draft a new release**.
2. Select the tag you just pushed and provide a descriptive title (e.g., `Dependency Graph & Criticality Alerts v0.1.0`).
3. Paste the release notes drafted earlier and attach any assets (Docker images, demo dataset snapshots) if applicable.
4. Publish the release.

## 6. Post-release actions

- Update project boards and roadmap items to reflect the new release status.
- Announce the release in the team Slack channel and, if relevant, to external stakeholders.
- Monitor telemetry and error reporting for regressions introduced in the release.

## 7. Hotfix workflow

1. Branch from the latest `main` and cherry-pick or implement the required fix.
2. Follow the same validation and PR steps above.
3. Tag the release using an incremented patch version (e.g., `v0.1.1`).

Following these steps ensures the repository stays in sync with GitHub and that new features are discoverable by the community.
