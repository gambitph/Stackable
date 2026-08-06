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
- [ ] 6. Draft article as WP block markup (paste-ready)
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
- Adjacent product payoffs that make a headline better (e.g. an existing UI that now works on the new feature)

Skip internal chores and fix spam unless users would notice or worry.

### 5. Pick headlines

Cap at **1–3** headline features that share one workflow story.

- Everything else either goes in a short **Other Improvements** list or is omitted
- Prefer cutting a fourth headline into “Other” over lengthening the article
- Continue the Design System / efficiency arc **only when true** — one linking sentence if related; never force it

### 6. Draft the article

Voice: warm founder walkthrough — clear and helpful, lightly first-person where it earns it (“I wanted…”, “tell me…”). Skimmable — aim for a **3–5 minute** read. Prefer concrete UI steps over slangy asides.

#### Required skeleton

1. **Title** (hand-off only — not in body markup) — `Introducing …` naming user-facing capabilities (commas / “and” for multiples). WP post title is the H1; **do not** put an H1 in the body.
2. **Opening teaser** — one short paragraph: version (`vMAJOR.MINOR.0`) + gap closed / why it matters + optional one-sentence product-arc link to prior posts
3. **More block** — immediately after the teaser (excerpt cut)
4. **Rundown** — “Here’s what’s new:” + bullet list of the 1–3 headlines
5. **H2 per headline** — what it is → where to click / happy path → why it matters → teaching visual. Include adjacent payoffs when true (how it plays with an existing control), not feature-vs-feature digressions
6. **Conclusion** — update CTA + soft feedback invite (no “— Ben” sign-off)

#### Optional sections (include only when earned)

| Section | When |
|---------|------|
| Old way vs new way | Real workflow shift only — skip for net-new UI |
| Backward compatibility / enable paths | Upgrader defaults differ, or something is removed/sunset — be specific (settings paths) |
| Other Improvements | User-visible trust items only (removals, renames, sunsets, notable fixes) — not a changelog dump |
| Changelog link | When “Other” exists or the release is large — always `href="/changelog/"` (site-relative on wpstackable.com) |
| Premium callout | Inline at the moment it appears; separate H2 only if Premium *is* the headline |
| Product-arc link | One sentence in the teaser when this release continues a prior chapter |

#### Media

At least **one teaching visual per headline**. In the paste markup, use empty `wp:image` figures with a useful `alt` and a figcaption that starts with **What to notice:** … Ben drops screenshots in after paste.

#### CTA rules

- Always: update to the version + soft feedback / community invite
- Premium upsell only if Premium was a real part of the story

#### Draft output (required form)

**Always** deliver the article body as **Gutenberg block markup** ready to paste into the WordPress block editor **Code editor**. Not markdown. Not a “preview then convert” step.

Use a fenced `html` code block so Ben can copy once. Match this shape:

```html
<!-- wp:paragraph -->
<p>…teaser with <strong>vMAJOR.MINOR.0</strong>…</p>
<!-- /wp:paragraph -->

<!-- wp:more -->
<!--more-->
<!-- /wp:more -->

<!-- wp:paragraph -->
<p>Here’s what’s new:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>Headline</strong> — short benefit</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Headline</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>…</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img alt="…"/><figcaption class="wp-element-caption">What to notice: …</figcaption></figure>
<!-- /wp:image -->
```

Compact list markup (list-item comments inside the `ul`/`ol`) is fine — matches what the block editor emits.

Above or beside the paste block, still state **title + slug** for the hand-off (those are not inside the body).

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
- Paste-ready body already in Gutenberg markup (with More block)
- The 1–3 headlines chosen (and what was demoted/omitted)
- Whether BC / Other / Premium sections were included and why
- Reminder: he edits voice/accuracy; publish same day as release; then ensure the readme bullet is live

## Style quick reference

| Do | Avoid |
|----|--------|
| Paste-ready `wp:*` block markup | Markdown drafts Ben must re-paste |
| Tight teaser → More → rundown | Long excited preamble before the cut |
| Short paragraphs, concrete UI steps | Deep tutorials / exhaustive option lists |
| Workflow + adjacent product payoffs | Feature-vs-feature digressions |
| Warm, clear founder tone | Slangy asides (“yeah. Same.”) |
| Changelog link `/changelog/` | wordpress.org plugin changelog URL |
| Body without H1 / without “— Ben” | Duplicating the post title or signed sign-off |
| Honest removals and BC | Hiding sunsets |
| Concrete counts when real (e.g. 375 designs) | Invented metrics |
| Free-first, Premium inline | Bolted-on Premium sections |

## Quality checklist

- [ ] Version confirmed; release deserves an article
- [ ] 1–3 headlines; skim-length; warm founder voice
- [ ] Body is Gutenberg markup; teaser → More → rundown; no H1 in body
- [ ] Opening names the version; each headline has an image placeholder with “What to notice:”
- [ ] Changelog (if linked) uses `/changelog/`
- [ ] BC/Other/Premium only when earned
- [ ] Conclusion: update + soft community/feedback CTA (no “— Ben”)
- [ ] readme bullet drafted with UTMs, newest-first format
- [ ] Handed off for Ben edit — not treated as final publish copy
