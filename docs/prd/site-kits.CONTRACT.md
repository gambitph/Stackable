# Site Kit import contract

This is the package schema and snap-in API.
Start Stackable implements the shell side.
The Stackable plugin implements import.
Changing this file requires updating both products' tests in the same change.

## Package

A Site Kit is a JSON document (CDN or bundled fixture) plus block markup strings.

**Default is not a package.**
Default is Start Stackable on activate (designed blog, no import).
The catalog may show a Default **label**.
That label does not import and does not reset.

```json
{
  "version": 1,
  "slug": "consultant",
  "title": "Consultant",
  "description": "Short plain-language summary.",
  "requires": {
    "stackable": ">=3.20.0",
    "theme": "start-stackable"
  },
  "theme": {
    "styleVariation": "indigo",
    "styles": {},
    "headerPart": "header-transparent",
    "footerPart": "footer",
    "headerFlags": {
      "sticky": true,
      "transparent": true
    }
  },
  "designSystem": {
    "colorScheme": {},
    "typography": {},
    "spacing": {}
  },
  "pages": [
    {
      "slug": "home",
      "title": "Home",
      "template": "full-width",
      "isFrontPage": true,
      "content": "<!-- wp:stackable/hero ... -->"
    }
  ],
  "patterns": [],
  "menu": {
    "location": "primary",
    "items": [
      { "page": "home", "label": "Home" },
      { "page": "about", "label": "About" }
    ]
  }
}
```

### Field rules

| Field | Rule |
| --- | --- |
| `version` | Integer. Importer rejects unknown major versions. |
| `slug` | Unique kit id. Theme-safe (`a-z0-9-`). Never `default`. |
| `requires.theme` | `"start-stackable"` is the intended shell. Import **still runs** on other themes; chrome flags no-op with a notice. |
| `theme.styleVariation` | Optional. Start Stackable `styles/` file slug. Ignored if missing. Applied before `theme.styles`. |
| `theme.styles` | Optional. `theme.json` **styles** object (and palette values that use the theme's slugs). Plugin writes user Global Styles. Empty or omitted means do not overlay. Lets a kit restyle chrome without a theme release. |
| `theme.headerPart` / `footerPart` | Template part slugs from the shell contract. |
| `theme.headerFlags` | `sticky`, `transparent` booleans. Plugin writes the classes/meta the theme documents. |
| `designSystem` | Maps onto existing Stackable Global Settings options. Empty object means "do not write GDS". |
| `pages[].template` | `full-width` \| `page` \| `blank`. Default for marketing pages is `full-width`. |
| `pages[].content` | Serialized Gutenberg HTML. Prefer `stackable/*` + core. No theme-owned custom blocks. |
| `pages[].isFrontPage` | At most one true. Importer sets `show_on_front` / `page_on_front`. |
| `patterns` | Optional pattern definitions to register or insert into the user pattern store. |
| `menu.items[].page` | Must match a `pages[].slug`. |

Token slugs in `theme.styles` and `designSystem` must match Start Stackable's palette / type / spacing slugs.
Do not invent a parallel slug vocabulary.

### Shell classes the plugin may write

On `body` or the header wrapper, as implemented by Start Stackable:

- `stk--is-stackable-theme` (theme)
- `stk-shell-header-sticky`
- `stk-shell-header-transparent`

Do not invent parallel class names in the plugin.

## REST (plugin)

Intended routes (names can match existing `stackable/v2` style):

| Method | Path | Job |
| --- | --- | --- |
| GET | `/stackable/v3/site-kits` | Catalog (slug, title, preview thumbs). May include a Default label that is not an importable slug. Free may list all kits. |
| GET | `/stackable/v3/site-kits/{slug}` | Full package for preview. Reject `default`. |
| POST | `/stackable/v3/site-kits/{slug}/import` | Apply. Capability: `edit_theme_options` + `edit_pages`. Reject `default`. |

Import is idempotent per slug: re-import updates the same pages (stored kit origin meta), it does not duplicate menus forever.
User consent is required (explicit button).
**No import on theme or plugin activation.**

## Ownership

| Write | Actor |
| --- | --- |
| Pages, menu, front page, page template | Plugin |
| Stackable Global Design System options | Plugin |
| Theme style variation | Plugin via core user global styles / FSE variation API |
| Theme styles overlay | Plugin via user Global Styles (`theme.styles`) |
| Header/footer part *assignment* | Plugin if the Site Editor API allows; otherwise document "user picks part" and prefer flags + recommended part slug |
| Sticky/transparent CSS | Theme |
| Block HTML inside pages | Plugin (kit package) |
| Default look (no kit) | Theme zip only |
