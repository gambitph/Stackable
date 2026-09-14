---
name: review-release
description: >-
  Review Stackable release-ready zip diffs against the current changelog.
  Use when the user invokes /review-release, after npm run release:ready,
  or when judging Freemius FREE/PAID zips before a release.
disable-model-invocation: true
---

# Review release

Judge the artifacts from `npm run release:ready`.
Do not rebuild, re-upload, unzip, or re-diff.
Do not edit plugin files.
Do not write a verdict file.
Print the full review to the terminal.

## Inputs

1. Read only the `= {version} =` section in repo `readme.txt`.
   `{version}` is the `Version:` header in `plugin.php`.
   Ignore older changelog sections.
2. Read these files under `build/release-ready/`:
   - `free.source.diff`
   - `free.sizes.json`
   - `free.tree.txt`
   - `paid.source.diff`
   - `paid.sizes.json`
   - `paid.tree.txt`
3. Open each unpacked zip's `readme.txt` / plugin header only to confirm `Version` / `Stable tag` match `{version}`.
   Do not use older changelog sections from those files.

FREE baseline is the WordPress.org zip (unpacked under `unpacked/wporg`).
PAID baseline is the previous released Freemius paid zip (`unpacked/paid-prev`).

## How to judge

Read the current changelog section first.
Every source hunk should map to a changelog line, or be Freemius-processor noise (SDK path, contributor, license comments), or get flagged.

Compiled files (`dist/**/*.js`, `dist/**/*.css`, images, fonts, maps) are size-only in `*.sizes.json`.
Do not read compiled diffs.
Flag a compiled row when `flag` is true (absolute delta over 200KB or over 50%, or the file appeared or disappeared).

Lost files, unexpected libraries, new vendor-looking dirs, and new security surface are findings.
Security surface includes unescaped output, new REST or AJAX, a new remote URL, or a loosened capability check.

FREE zip must stay Directory-safe:
- no `pro__premium_only/`
- `STACKABLE_BUILD` is `free`
- no premium-only strings that should have been stripped

PAID zip should keep premium files the previous paid zip had, plus changelog-justified additions.

## Output

Print a verbose review to the terminal, in this order:

1. Version
2. Changelog used (the current section only)
3. FREE findings
4. PAID findings
5. Compiled size flags
6. Final line: `GREEN LIGHT` or `BLOCKED` plus a one-line reason
