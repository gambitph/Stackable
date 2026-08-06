---
name: write-news-article
description: >-
  Drafts a Stackable release news article and the matching readme.txt News
  Article Updates link. Use when the user asks to write a news article, release
  blog post, News Article Update, or invokes write-news-article.
disable-model-invocation: true
---

# Write News Article

Draft a **major.minor feature-release** blog post for wpstackable.com, plus the `readme.txt` News Article Updates bullet. Benjamin edits voice and accuracy before publish.

This is **not** the changelog. For changelog bullets, use `add-changelog`.

## Project context (do not hardcode)

Do **not** embed repo URLs, org names, or project board links in assumptions.

Read the **current project's Cursor rules** (e.g. `.cursor/rules/` for repos / release roadmap). Use those for roadmap lookup. If missing, ask before guessing.

## When to write

| Write | Skip |
|-------|------|
| Meaningful `x.y.0` with a user-facing workflow story | Patch releases (`x.y.z`) |
| | Pure maintenance / no headline workflow change |

## Goals (priority order)

1. **Teach** — skimmable guided overview (where it lives, happy path)
2. **Market** — make updating feel worthwhile
3. **Document** — durable product-story breadcrumb

Audience: builders and agencies using or evaluating Stackable. Free-first; Premium only when it is part of the story.

## Workflow

Copy and track:

```
Write News Article:
- [ ] 1. Resolve proposed version
- [ ] 2. Confirm version with user (wait for reply / override)
- [ ] 3. Confirm this release deserves an article
- [ ] 4. Gather sources (changelog + roadmap)
- [ ] 5. Pick 1–3 headlines; park the rest
- [ ] 6. Draft article (Ben first-person, skim-length)
- [ ] 7. Draft readme.txt News Article Updates bullet
- [ ] 8. Hand off for Ben edit (do not publish)
```

### 1. Resolve proposed version

Same sources as `add-changelog`:

1. Prefer `Version:` in root `plugin.php`
2. Else main plugin bootstrap PHP
3. Optionally note `Stable tag:` in `readme.txt`

Propose the **major.minor** feature version (e.g. `3.20.0` → article for `3.20`), not a patch.

### 2. Confirm version with user (required)

**Stop and ask** before drafting.

Tell the user the proposed version. Wait for confirm or override. That value is `VERSION` (use `MAJOR.MINOR` in titles/links, e.g. `3.20`).

### 3. Confirm the release deserves an article

If the changelog/roadmap has no clear user-facing workflow story, say so and ask whether to skip. Do not invent a news post for a maintenance minor.

### 4. Gather sources

From project Cursor rules, open the Release Roadmap for `VERSION`. Also read the `= VERSION =` (and related patch) changelog section in `readme.txt`.

Pull:

- Candidate headline features (`New:` / major `Change:`)
- User-visible removals, renames, sunsets, BC-relevant items
- Premium-only bits tied to headlines

Skip internal chores and fix spam unless users would notice or worry.

### 5. Pick headlines

Cap at **1–3** headline features that share one workflow story.

- Everything else either goes in a short **Other Improvements** list or is omitted
- Prefer cutting a fourth headline into “Other” over lengthening the article
- Continue the Design System / efficiency arc **only when true** — one linking sentence if related; never force it

### 6. Draft the article

Voice: **Benjamin’s first-person walkthrough** (“I”, casual, founder tone). Skimmable — aim for a **3–5 minute** read. Users will not study it; keep each headline to a few short paragraphs + one visual placeholder.

#### Required skeleton

1. **Title** — `Introducing …` naming user-facing capabilities (commas / “and” for multiples)
2. **Opening** — excitement + why it matters + version callout (`Update to vMAJOR.MINOR.0`) + short rundown of headlines
3. **H2 per headline** — what it is → (optional old-vs-new) → where to click / happy path → why it matters
4. **Conclusion** — personal sign-off + update CTA + soft feedback/community invite

#### Optional sections (include only when earned)

| Section | When |
|---------|------|
| Old way vs new way | Real workflow shift only — skip for net-new UI |
| Backward compatibility / enable paths | Upgrader defaults differ, or something is removed/sunset — be specific (settings paths) |
| Other Improvements | User-visible trust items only (removals, renames, sunsets, notable fixes) — not a changelog dump |
| Changelog link | When “Other” exists or the release is large |
| Premium callout | Inline at the moment it appears; separate H2 only if Premium *is* the headline |
| Product-arc link | One sentence when this release continues a prior chapter |

#### Media

At least **one teaching visual per headline** (screenshot or short video). Use markdown image/video placeholders with captions that say what to notice. Text-only only as a last resort.

#### CTA rules

- Always: update to the version + soft feedback / community invite
- Premium upsell only if Premium was a real part of the story

#### Draft output

Present the full draft in markdown for Ben to edit. Mark visual placeholders clearly, e.g. `[SCREENSHOT: Design Library Pages tab with 40 templates]`.

Do **not** publish to the blog or commit unless the user asks.

### 7. Draft the readme.txt bullet

Under `### News Article Updates`, newest first:

```
- [vMAJOR.MINOR Feature Names…](https://wpstackable.com/blog/SLUG/?utm_source=wp-repo&utm_campaign=readme&utm_medium=link)
```

Rules:

- `vMAJOR.MINOR` only (no patch)
- Link text ≈ headline features (can be shorter than the full title)
- Slug usually `introducing-…` kebab-case matching the title
- Always append the UTM query string above
- Add when the article goes live / in the same release PR — same day as the plugin release

If editing `readme.txt` in this session, insert the bullet at the **top** of the News Article Updates list. If the live URL is not final yet, draft the bullet and ask Ben to confirm the slug before writing.

### 8. Hand off

Summarize for Ben:

- Proposed title + slug
- The 1–3 headlines chosen (and what was demoted/omitted)
- Whether BC / Other / Premium sections were included and why
- Reminder: he edits voice/accuracy; publish same day as release; then ensure the readme bullet is live

## Style quick reference

| Do | Avoid |
|----|--------|
| Short paragraphs, concrete UI steps | Deep tutorials / exhaustive option lists |
| Workflow and efficiency framing | Changelog tone (`Fixed: … #1234`) |
| Honest removals and BC | Hiding sunsets |
| Concrete counts when real (e.g. 375 designs) | Invented metrics |
| Free-first, Premium inline | Bolted-on Premium sections |

## Quality checklist

- [ ] Version confirmed; release deserves an article
- [ ] 1–3 headlines; skim-length; Ben first-person
- [ ] Opening names the version; each headline has a visual placeholder
- [ ] BC/Other/Premium only when earned
- [ ] Conclusion: update + soft community/feedback CTA
- [ ] readme bullet drafted with UTMs, newest-first format
- [ ] Handed off for Ben edit — not treated as final publish copy
