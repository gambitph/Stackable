# PR body: triage-first template

Load only when opening the pull request after `reference/ship.md`.
Completion: verdict assigned by the mapping below; Caution non-empty when Medium/High; body matches the template; `gh pr create` succeeded; PR URL returned to the user.

## Inputs

Use ensure-quality Summary fields only:

- Intent
- Risk (`Low` / `Med` / `High` - normalize Med → Medium in the table)
- Diff scope (fixed point, key files)
- Findings (per-stage counts; auto-fixed / HITL / accepted / remaining; anti-slop / risk-lens hits)
- Tests run
- Docs
- Lint
- Ship readiness (`ready`)
- Uncommitted fix set (now committed - list what the gate changed)

Also use git: base branch, head branch, shortstat if helpful.

## Verdict mapping

| Condition | Verdict | PR state |
| --- | --- | --- |
| Risk Low, no open Caution signal | `LOW_RISK_MERGE` | ready for review |
| Risk Medium, **or** Risk Low with accepted/notable warnings or anti-slop cautions the reviewer should see | `MEDIUM_REVIEW` | ready for review |
| Risk High | `HIGH_HOLD` | **draft** (`gh pr create --draft`) unless the user already approved shipping high risk |

**Caution signal** means any of: HITL-accepted findings that remain material, anti-slop hits called out in Summary, risk-lens warnings kept as follow-ups, or review notes that say "safe to proceed with concerns".

### Caution rules

- **LOW_RISK_MERGE** - Caution section may be `None.` 
- **MEDIUM_REVIEW** / **HIGH_HOLD** - write numbered, concrete items: `path` (and line when known), what happened or what to verify, why it matters for merge.
- Never leave Caution empty on Medium/High.
- Prefer the gate's own finding text over paraphrasing away detail.

## Title

One line from Intent (≤72 chars when practical).
Do not start with "Quality gated" - lead with the product change.

## Body template

Fill every section. Keep the Triage table first so humans and agents can skim.

```markdown
## Triage

| Field | Value |
| --- | --- |
| **Verdict** | <LOW_RISK_MERGE \| MEDIUM_REVIEW \| HIGH_HOLD> |
| **Risk** | <Low \| Medium \| High> |
| **Ship readiness** | ready |
| **Anti-slop** | <clean \| cautioned (N hits)> |
| **Tests** | <pass \| pass with skips \| n/a> |
| **Lint** | <pass \| n/a> |

### Reviewer action
- **LOW_RISK_MERGE** - Skim intent + diffstat; merge if CI green.
- **MEDIUM_REVIEW** - Read **Caution** and linked hunks before merge.
- **HIGH_HOLD** - Do not merge until Caution items are checked or resolved.

### Caution
<None. | numbered list>

---

## Intent
<ensure-quality Intent paragraph>

## Diff scope
Fixed point: `<ref>` → this PR
Key files:
<bullets>

## Quality gate findings

| Stage | Auto-fixed | HITL accepted | Remaining | Notes |
| --- | --- | --- | --- | --- |
| Review | <n> | <n> | <n> | <risk/anti-slop callouts or —> |
| Test | <n> | <n> | <n> | <—> |
| Document | <n> | <n> | <n> | <—> |
| Lint | <n> | <n> | <n> | <—> |

### Notable findings
<bullets from gate, or None.>

## Verification
- Tests: `<commands>` → <pass/fail; skips + why>
- Docs: <updated | checked | none needed>
- Lint: `<commands>` → <result>

## Gate fix set
<bullets of quality fixes that landed in this PR, or None.>

## Merge checklist
- [ ] CI green
- [ ] Caution items reviewed (N/A if Low / None)
- [ ] No secrets, premium bleed, or phantom tools/abilities in the diff
```

Use an ASCII hyphen `-` in prose (not an em dash), matching repo agent notes.

## Create the PR

Gather status/diff/log vs base as required by the environment's PR protocol, then:

```bash
gh pr create --base <base> --title "<title>" --body "$(cat <<'EOF'
<body>
EOF
)"
```

Add `--draft` when verdict is `HIGH_HOLD` and the user did not override.

If a PR for this branch already exists, update its body with `gh pr edit` instead of opening a duplicate - preserve the triage-first template.

## Return to user

State, in order:

1. PR URL
2. Verdict
3. One-line Risk rationale from the gate
4. Whether the PR is draft
