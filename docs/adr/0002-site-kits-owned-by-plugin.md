# Site Kits owned by the plugin

The approved **Site Kits Design Document**, dated November 18, 2026, is the master product reference for Site Kits.
This ADR supplies ownership decisions where that design is silent.

Site Kits are a Stackable plugin feature.
Start Stackable is the required shell for applying Site Kits, not the importer.

WordPress.org Theme Review forbids demo import inside a theme.
Full-site starter packages belong in the companion plugin, not in the theme zip.
Putting kit markup in the theme would also ship `stackable/*` blocks that are missing when the plugin is off.

The plugin owns development export, catalog, preview, color-scheme editing, theme installation and activation flow, and import.
The theme owns header, footer, tokens, and header flags listed in the Start Stackable shell contract.
Default (first-activation look) is the theme, not a kit ([`0003-default-is-the-theme.md`](./0003-default-is-the-theme.md)).
Start Stackable must be active before the plugin applies a Site Kit.
The catalog and previews remain available while the theme is missing or inactive.
The package, export, and import schema is [`site-kits.CONTRACT.md`](../prd/site-kits.CONTRACT.md).
