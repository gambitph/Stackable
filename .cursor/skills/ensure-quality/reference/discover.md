# Discover the project

Run once per gate.
Prefer the **environment** (scripts, configs, CI, agent docs) over memorized stacks.
Record what you chose so stages reuse the same commands.

## Where to look (in order)

1. Agent / contributor docs: `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `docs/agents/`, `README*` sections on test/lint
2. Manifest scripts: `package.json` `scripts`, `composer.json` `scripts`, `Makefile` / `justfile`, `pyproject.toml` / `tox.ini`, `Cargo.toml`, `go.mod`
3. CI workflows: `.github/workflows/*`, other CI configs - what they run on PR is a strong default
4. Tool configs that imply a runner: `phpunit.xml*`, `playwright.config.*`, `jest.config.*`, `eslint*`, `phpcs.xml*`, `.prettierrc*`, `ruff.toml`, etc.

If two sources disagree, prefer explicit agent/contributor docs, then CI, then manifest script names.

## Test commands

Pick a **baseline** suite (fast, always-on) and optional **extended** suites (e2e, integration, browser):

| Prefer as baseline | Examples of names |
| --- | --- |
| Unit / default test script | `test`, `test:unit`, `composer test`, `pytest`, `go test ./...`, `cargo test` |
| Prefer as extended | `test:e2e`, `test:integration`, `test:browser`, Playwright/Cypress jobs in CI |

**Always run** the baseline when one exists.
**Run extended** when the diff touches UI, e2e fixtures/specs, end-to-end harness config, or public HTTP/UI surfaces those suites cover - or when intent/user asks for full/e2e.
If no test command exists, record `Tests: none discovered` and emit a `warning` / `ask-user` finding only if the diff clearly adds behavior with zero coverage expectation from repo docs.

## Lint / format commands

Map touched languages to the repo's linters:

- JS/TS → scripts like `lint`, `lint:js`, `eslint`; fix via `lint:fix` / `lint:js:fix` when present
- CSS → `lint:css`, stylelint
- PHP → `lint:php`, `phpcs`, `pint`
- Python → `ruff`, `flake8`, `black --check`
- Go/Rust/other → `golangci-lint`, `cargo fmt --check`, etc.

Scope to languages the diff actually touches.
Use autofix flags only for mechanical cleanup on files you touched - do not reformat the universe.
If a pre-commit hook runs a subset, still run the full discovered lint for touched languages so the gate is green *before* commit.
If nothing is discovered, record `Lint: none discovered` and skip without failing.

## Standards sources (review)

Collect paths that state how code should be written, for example:

- `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `CODING_STANDARDS.md`
- `.cursor/rules/**`, language/style guides under `docs/`
- Package/ecosystem norms the repo already documents

Hand the list to the review stage.
Repo docs override the skill baselines (`reference/anti-slop.md`, `reference/smells.md`) on conflict.

## Anti-slop / maintainability sources

Explicitly hunt and record:

- Rules or docs named anti-slop, maintainability, deep modules, catalogue/catalog discipline
- "Ship or silence" / phantom-name / single-source catalogue guidance
- Change checklists (e.g. ability/tool/API add-or-rename preflight)

These are **hard Standards** for the review stage when present.
The skill's `reference/anti-slop.md` still always runs as the generic baseline.

## Doc surfaces (document)

Infer which docs this repo treats as law or sync targets, for example:

- Contracts / ADRs / architecture docs
- Agent checklists under `docs/agents/`
- README / API docs the project says must stay current
- Domain glossary files (`CONTEXT.md`, etc.) when present

Only sync surfaces the **diff obligates**.
If the repo documents a conflict rule (e.g. "PRD wins over how-it-works"), obey it; otherwise prefer not inventing product law - fix stale implementation docs or escalate.

## Advisory tools

Optional checkers mentioned in docs but not in scripts (dependency audit, plugin directory check, typecheck beyond lint) are **advisory**:
run when cheap and available; if missing, note `not run` in the summary - do not block solely for absent tooling.
