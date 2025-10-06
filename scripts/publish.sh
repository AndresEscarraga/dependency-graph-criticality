#!/usr/bin/env bash
set -euo pipefail

cat <<'INSTRUCTIONS'
# GitHub Publishing Checklist

1. **Authenticate with GitHub**
   - Ensure that `git config user.name` and `git config user.email` are set.
   - Run `gh auth login` (GitHub CLI) or configure an HTTPS/SSH credential helper.

2. **Check repository status**
   - Run `git status` to confirm a clean working tree.
   - Pull latest changes with `git pull --rebase origin main` (replace `main` if using another default branch).

3. **Run quality gates**
   - Install dependencies: `pnpm install`.
   - Execute quality commands as needed:
     - `pnpm lint`
     - `pnpm test`
     - `pnpm build`

4. **Tag the release (optional)**
   - Decide on the version bump and update `package.json` if required.
   - Create a tag: `git tag -a v0.1.0 -m "Release v0.1.0"`.

5. **Push commits and tags**
   - Push branch: `git push origin <branch-name>`.
   - Push tags if created: `git push origin v0.1.0`.

6. **Open a Pull Request (if working on a feature branch)**
   - Use `gh pr create --fill` or open a PR via the GitHub UI.
   - Ensure CI (GitHub Actions) passes before merging.

7. **Publish release (if tagged)**
   - In GitHub UI: Releases → Draft new release.
   - Select the tag, add notes from `docs/RELEASE.md`, and publish.

8. **Verify deployment**
   - Monitor CI/CD outputs and confirm the application is available.

Refer to `docs/RELEASE.md` for additional details on release cadence and responsibilities.
INSTRUCTIONS
