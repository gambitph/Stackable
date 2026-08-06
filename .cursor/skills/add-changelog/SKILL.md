---
name: add-changelog
description: >-
  Adds or updates a WordPress plugin changelog entry in readme.txt from the
  project's Release Roadmap for a confirmed plugin version. Use when the user
  asks to add a changelog, write changelog entries, update readme.txt
  Changelog, or invokes add-changelog.
disable-model-invocation: true
---

# Add Changelog

Add or update a `== Changelog ==` entry in `readme.txt` for a confirmed plugin version, using issues and PRs from the project's Release Roadmap.

## Project context (do not hardcode)

Do **not** embed repo URLs, org names, or project board links in this skill's workflow output or assumptions.

Instead, read the **current project's Cursor rules** (e.g. `.cursor/rules/`, especially anything covering repos, release roadmap, or project boards). Those rules are the source of truth for:

- Main plugin repo(s)
- Premium / companion repos (if any)
- Release Roadmap / GitHub project board URL and how versions are organized

If those rules are missing or unclear, ask the user before guessing.

## Workflow

Copy and track:

```
Add Changelog:
- [ ] 1. Resolve proposed version
- [ ] 2. Confirm version with user (wait for reply / override)
- [ ] 3. Detect new vs existing changelog section
- [ ] 4. Locate Release Roadmap items for that version
- [ ] 5. Draft concise changelog lines
- [ ] 6. Write into readme.txt (insert new or update existing)
```

### 1. Resolve proposed version

Find the plugin version from the WordPress plugin header `Version:` field:

1. Prefer `plugin.php` in the project root.
2. Else `{plugin-slug}.php` / `{ProjectName}.php` (main plugin bootstrap file).
3. Optionally note `Stable tag:` in `readme.txt` for context; the **plugin header Version** is the default proposal.

### 2. Confirm version with user (required)

**Stop and ask** before collecting roadmap items or editing files.

Tell the user the proposed version (e.g. `Found Version: 3.20.0 in plugin.php`). Ask them to:

- Confirm it, **or**
- Type a different version number to use instead

Do not proceed until they reply. Use their confirmed (or overridden) value as `VERSION`.

### 3. Detect new vs existing section

In `readme.txt`, under `== Changelog ==`, check for a heading `= VERSION =`.

| Result | Mode |
|--------|------|
| Heading **missing** | **New** — create a new section for `VERSION` |
| Heading **present** | **Update** — refresh that section from the Release Roadmap |

Tell the user which mode you are using.

### 4. Collect Release Roadmap items

From the project's Cursor rules, open the **Release Roadmap** (GitHub project / issues list organized by target version).

Collect **issues and PRs** targeted at the same version as `VERSION` (matching the board's version field, column, or label — use whatever the project rules describe).

Prefer `gh` for GitHub access. Include:

- Closed and open items still listed under that version (unless the user says closed-only)
- Both issues and pull requests
- Linked PR numbers when the fix lives on a PR; otherwise the issue number

Skip items that are clearly not user-facing (pure chores, triage-only, duplicate closes) unless the user wants everything.

### 5. Draft entries

Write **concise, short, easy-to-understand** lines for end users. Prefer area + outcome over implementation detail.

**Format:**

```
= VERSION =

* New: A new feature introduced #PR/Issue-number
* Change: Just a change that's either a new feature or a bug fix #PR/issue-number
* Fixed: Area fixed - short description of what was fixed #PR/issue-number
* More entries...
```

**Prefixes:**

| Prefix | Use for |
|--------|---------|
| `New:` | New feature or capability |
| `Change:` | Behavior/UX/API change that is not purely a bug fix |
| `Fixed:` | Bug fix |

**Style rules:**

- One line per item; keep under ~100 characters when practical
- Lead with the area when helpful (`Image box - …`, `Posts block - …`)
- End with `#` + issue or PR number (no URL)
- Prefer the PR number when a PR closed the work; else the issue number
- Group loosely: `New` → `Change` → `Fixed` (optional but preferred)
- No marketing fluff; no internal jargon

**Example:**

```
* Fixed: Image box - button group overlaps with each other #3300
```

#### New mode

Draft a full new `= VERSION =` block from the Release Roadmap.

#### Update mode

1. Read the existing bullets under `= VERSION =`.
2. Rebuild the section from the Release Roadmap so it reflects current roadmap items.
3. Keep existing lines that still match a roadmap item (same `#number`); rewrite wording only when the roadmap/title is clearer.
4. Add missing roadmap items.
5. Remove or replace bullets whose `#number` is no longer on the roadmap for this version (unless the user asks to keep orphans).
6. Avoid duplicate `#number`s.

### 6. Write `readme.txt`

After drafting, write immediately — no draft sign-off.

**New mode**

1. Find `== Changelog ==`.
2. Insert the new `= VERSION =` block **immediately after** that heading (above older versions).
3. Preserve existing older changelog sections unchanged.

**Update mode**

1. Replace the contents of the existing `= VERSION =` section (heading through the last bullet before the next `= … =` or end of changelog) with the draft.
2. Do not create a second section for the same version.
3. Leave all other version sections unchanged.

Match surrounding blank-line style (typically one blank line after `= VERSION =`, then bullets).

Briefly summarize what was written. Do not commit unless the user asks.

## Quality checklist

- [ ] Version confirmed (or overridden) by the user
- [ ] Correct mode: new insert vs update existing section
- [ ] Items come from the Release Roadmap for that version (via project Cursor rules)
- [ ] Lines use `New:` / `Change:` / `Fixed:` and end with `#number`
- [ ] Wording is user-facing and brief
- [ ] New sections go at the top of Changelog; updates stay in place
