# Saved Patterns in the Design Library

Premium-only feature that lets users save Stackable Columns layouts to a personal design library, then reuse them from the **Saved** tab in the Design Library modal.

Free plugin provides the Saved tab UI and integration hooks. Premium plugin provides storage, REST API, save/edit/delete UI, and import/export.

## Architecture

```
Editor (block ⋮ menu)          Design Library modal (Saved tab)       Stackable Settings (Import/Export)
        │                                    │                                      │
        ▼                                    ▼                                      ▼
 SaveModal / edit UI              lazy-components/design-library          welcome/import-export
        │                                    │                                      │
        └──────────────┬─────────────────────┴──────────────────┬───────────────┘
                       ▼                                        ▼
              pro__premium_only/src/design-library/user-patterns.js
                       │
                       ▼
              REST stackable/v3/user_patterns  →  CPT stk-user-pattern (PHP)
```

## Storage

Patterns are stored as a **private custom post type** `stk-user-pattern` (not public, hidden from admin UI and REST index).

| Field | CPT mapping |
|-------|-------------|
| `id` (slug) | `post_name` |
| `label` | `post_title` |
| `description` | `post_excerpt` |
| `category` | post meta `_stk_pattern_category` |
| `template` | `post_content` (serialized block markup) |

**Create** writes all fields including `post_content`.

**Update** (`PUT /user_patterns/{slug}`) changes metadata only — label, slug, description, category. It does **not** replace `post_content`, so editing a pattern never overwrites the saved block markup.

## REST API (`stackable/v3`)

| Method | Route | Capability | Purpose |
|--------|-------|------------|---------|
| `GET` | `/user_patterns` | `edit_posts` | List patterns for the Saved tab |
| `POST` | `/user_patterns` | `edit_theme_options` | Create pattern |
| `PUT` | `/user_patterns/{slug}` | `edit_theme_options` | Update metadata |
| `DELETE` | `/user_patterns` | `edit_theme_options` | Bulk delete by slug |
| `POST` | `/user_patterns/import` | `manage_options` | Bulk import from export file |

PHP: `pro__premium_only/src/design-library/user-patterns.php`

JS client: `pro__premium_only/src/design-library/user-patterns.js` (session cache, invalidated on writes)

## Capabilities & UI gating

| Action | Capability | Where gated |
|--------|------------|-------------|
| View / insert saved patterns | `edit_posts` | REST `GET` |
| Save, edit, delete | `edit_theme_options` | REST writes; block ⋮ menu; edit/delete buttons in Saved tab |
| Import patterns (settings page) | `manage_options` | REST import endpoint |

The Design Library modal calls `useCanManageUserPatterns()` once on open and passes `canManageUserPatterns` through `DesignLibraryContext` so tab switches do not re-check capability per card.

Outside the modal (e.g. block ⋮ **Save to Design Library**), `useCanManageUserPatterns` in `src/hooks/use-can-manage-user-patterns.js` is used directly.

## Saving a pattern

1. User selects a **Stackable Columns** block and chooses **Save to Design Library** from the block ⋮ menu.
2. `pro__premium_only/src/plugins/design-library-save-pattern-button/` opens `SaveModal`.
3. On save, the modal serializes the selected blocks via `@wordpress/blocks` `serialize()` and `POST`s to `/user_patterns`.
4. `stackable.design-library.pattern-saved` action fires; a notice points the user to the Design Library Saved tab.

Only Columns blocks are allowed. Other Stackable blocks show the menu item disabled.

## Using saved patterns

1. User opens the Design Library modal and switches to the **Saved** tab.
2. `getDesigns({ type: 'saved' })` in `src/design-library/index.js` calls the `stackable.design-library.get-saved-designs` filter (premium registers `fetchSavedPatterns`).
3. Patterns are **lazy-loaded** on first visit to the Saved tab — not on editor boot.
4. User selects patterns and clicks **Add Designs** to insert them like cloud patterns.

Free users see a Pro upsell on the Saved tab instead of the list.

## Edit & delete

- **Edit** — pencil button on each saved item (premium). Opens `SaveModal` in `UPDATE` mode; only label, slug, category, and description are sent.
- **Delete** — bulk delete in the modal footer when items are selected on the Saved tab.

Both are hidden when `canManageUserPatterns` is false.

## Import / export

Stackable Settings → Import/Export → Design Library tab.

- **Export** — patterns fetched via `stackable.design-library.fetch-saved-patterns` filter; user selects which to include in the JSON file.
- **Import** — selected patterns from the JSON file are sent through `stackable.admin-settings.import-export.handle-import` → `importUserPatterns()` → `POST /user_patterns/import` with `ADD`, `SKIP`, or `OVERWRITE` duplicate handling.

Free wiring: `src/welcome/import-export/design-library.js`  
Premium UI + import handler: `pro__premium_only/src/welcome/import-export/design-library.js`

## Key files

### Free plugin

| File | Role |
|------|------|
| `src/design-library/index.js` | `getDesigns({ type: 'saved' })` filter hook |
| `src/design-library/init.php` | `type=saved` REST route; `stackable_design_library_saved_patterns` filter |
| `src/lazy-components/design-library/` | Modal, Saved tab, lazy fetch |
| `src/hooks/use-can-manage-user-patterns.js` | Capability check hook |
| `src/welcome/import-export/design-library.js` | Import/export tab loader |

### Premium plugin (`pro__premium_only/`)

| File | Role |
|------|------|
| `src/design-library/user-patterns.php` | CPT registration, REST routes, sanitization |
| `src/design-library/user-patterns.js` | REST client + cache |
| `src/design-library/index.js` | Registers `get-saved-designs` and `fetch-saved-patterns` filters |
| `src/block-components/design-library/save-modal.js` | Save / edit modal |
| `src/block-components/design-library/index.js` | Edit button, bulk delete filters |
| `src/block-components/design-library/store.js` | `stackable/design-library-saved-patterns` data store |
| `src/plugins/design-library-save-pattern-button/` | Block ⋮ menu entry |

## WordPress hooks

| Hook | Purpose |
|------|---------|
| `stackable.design-library.get-saved-designs` | Premium returns pattern list for `getDesigns()` |
| `stackable.design-library.fetch-saved-patterns` | Premium returns promise for import/export lazy load |
| `stackable_design_library_saved_patterns` | PHP filter; premium returns CPT data for `init.php` saved route |
| `stackable.design-library.pattern-label-actions` | Premium renders edit button per saved item |
| `stackable.design-library.footer-selection-actions` | Premium renders bulk delete button |
| `stackable.design-library.saved-patterns-loaded` | Fired when patterns list updates (syncs store + modal) |
| `stackable.design-library.pattern-saved` | Fired after a successful save from the block menu |
