# Site Kits owned by the plugin

Site Kits are a Stackable plugin feature.
Start Stackable is the recommended shell, not the importer.

WordPress.org Theme Review forbids demo import inside a theme.
Full-site starter packages belong in the companion plugin, not in the theme zip.
Putting kit markup in the theme would also ship `stackable/*` blocks that are missing when the plugin is off.

The plugin owns catalog, preview, design-system side editor, and import.
The theme owns chrome, tokens, and header flags listed in the Start Stackable shell contract.
Default (first-activation look) is the theme, not a kit ([`0003-default-is-the-theme.md`](./0003-default-is-the-theme.md)).
The import package schema is [`site-kits.CONTRACT.md`](../prd/site-kits.CONTRACT.md).
