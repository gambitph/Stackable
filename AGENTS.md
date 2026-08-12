# Stackable agent notes

## Product & architecture docs

| Kind | Where |
| --- | --- |
| Glossary | [`CONTEXT.md`](./CONTEXT.md) |
| Architecture map | [`docs/architecture.md`](./docs/architecture.md) |
| ADRs | [`docs/adr/`](./docs/adr/) |
| E2E harness | [`e2e/readme.md`](./e2e/readme.md) |
| Release roadmap | [GitHub Project #2](https://github.com/orgs/gambitph/projects/2/views/1) |
| Free / premium repos | [`.cursor/rules/project-repos.mdc`](./.cursor/rules/project-repos.mdc) |
| Issue labels / triage | [`.cursor/rules/issue-labels.mdc`](./.cursor/rules/issue-labels.mdc), [`.cursor/rules/issue-triage.mdc`](./.cursor/rules/issue-triage.mdc) |

Product PRDs and colocated `CONTRACT.md` files may be added under `docs/prd/` (and premium under `pro__premium_only/docs/prd/`) as behaviour is documented.
Until then, treat shipped code plus ADRs / architecture as the source of truth, and do not invent product law in how-it-works notes.

When code and docs disagree: **ADR / contract / PRD win** when they exist (WordPress.org / Plugin Check constraints still apply to free packaging).
How-it-works maps (colocated `*.md`, notes like `src/dynamic-breakpoints.md`) describe current machinery only - they must not invent product law.

Changing a deep-module **interface** requires updating the matching docs and tests in the same change.

## General guidelines

- Never use the em dash "—". Use plain dash "-" instead, but if applicable, just use a comma.
- When writing commit messages, NEVER auto-add your agent name as co-author.
- Never manually modify CHANGELOG.md files or any files that are marked as auto-generated.
- When writing or substantially editing long Markdown files, put each full sentence on its own line.
  Preserve normal Markdown structure, but avoid wrapping multiple sentences onto one physical line.
- When making technical decisions, do not give much weight to development cost.
  Instead, prefer quality, simplicity, robustness, scalability, and long term maintainability.
- When doing bug fixes, always start with reproducing the bug in an E2E setting as closely aligned with how an end user would experience it as possible.
  This makes sure you find the real problem so your fix will actually solve it.
- When end-to-end testing a product, be picky about the UI you see and be obsessed with pixel perfection.
  If something clearly looks off, even if it is not directly related to what you are doing, try to get it fixed along the way.
- Apply that same high standard to engineering excellence: lint, test failures, and test flakiness.
  If you see one, even if it is not caused by what you are working on right now, still get it fixed.

## Coding standards (agents)

Maintainability / anti-slop (deepen seams, no phantom settings or freemium leaks): [`.cursor/rules/anti-slop.mdc`](./.cursor/rules/anti-slop.mdc) - always-on Cursor rule.

JavaScript / React surfaces (plain `.js`, editor React, frontend view scripts): [`.cursor/rules/javascript-react.mdc`](./.cursor/rules/javascript-react.mdc).

WordPress.org / Plugin Check for free builds: [`.cursor/rules/wordpress-plugin-check.mdc`](./.cursor/rules/wordpress-plugin-check.mdc).

## Agent skills

Project skills live under [`.cursor/skills/`](./.cursor/skills/). Prefer the WordPress plugin, block-development, directory-guidelines, REST, and performance skills for Stackable work.
React composition / best-practice skills apply mainly to block editor and admin UI under `src/`.

Stackable-specific skills: `add-changelog`, `write-news-article`.

### Issue tracker

GitHub Issues on this repo (`gambitph/Stackable`) via the `gh` CLI.
Roadmap / version targeting: [org project #2](https://github.com/orgs/gambitph/projects/2/views/1).
Do not apply GitHub changes (close, comment, relabel) during issue triage without user sign-off - see `issue-triage` rule.

### Testing

- Unit / Jest: `npm test` (and related `test:*` scripts in `package.json`).
- Playwright e2e: see [`e2e/readme.md`](./e2e/readme.md) (`npm test` / `npm run test:debug` with `.env` configured).
- Lint: `npm run lint` / `lint-js` / `lint-css` as appropriate for touched files.

### Quality gate

Local review (incl. anti-slop) → test → document → lint before commit / after substantive or AI-generated changes.
Skill: `.cursor/skills/ensure-quality/` (project-agnostic; loads this repo's anti-slop rules via discovery).

## Free / premium

Agent workflow files (`AGENTS.md`, `.cursor/rules/`, `.cursor/skills/`) live in the **free** repo root so they apply to main plugin work and premium work checked out under `pro__premium_only/`.

- Premium feature code belongs only under `pro__premium_only/`.
- Gate-load with `STACKABLE_BUILD === 'premium'` and Freemius premium checks.
- Free package must not include `pro__premium_only/` and must stay Plugin Check clean.
